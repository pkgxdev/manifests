import LibrarySymlinkEnsurer from "./fixups/library-symlink-ensurer.ts";
import { fix_pkg_config_file } from "./fixups/fix-pkg-config-file.ts";
import { EmptyDirectoryPruner } from "./fixups/empty-dir-pruner.ts";
import { fix_cmake_file } from "./fixups/fix-cmake-file.ts";
import RehardLinker from "./fixups/rehard-linker.ts";
import fix_shebang from "./fixups/fix-shebang.ts";
import RpathFixer from "./fixups/rpath-fixer.ts";
import Stripper from "./fixups/Stripper.ts";
import { walk } from "jsr:@std/fs@1/walk";
import { mime } from "./fixups/utils.ts";
import { flatmap, Path } from "brewkit";

export default async function default_fixups(
  prefix: Path,
  dep_prefixes: Path[],
  PKGX_DIR: Path,
  original_PKGX_DIR: Path,
  process: (path: Path) => boolean = () => true,
) {
  // fix pkgs putting man at the root rather than in `share`
  flatmap(
    prefix.join("man").isDirectory(),
    (mandir) => mandir.mv({ into: prefix.join("share").mkdir() }),
  );

  let walker = walk(prefix.string, {
    includeFiles: true,
    includeDirs: true,
    includeSymlinks: true,
  });

  const rpather = new RpathFixer(prefix, dep_prefixes, PKGX_DIR);
  const pruner = new EmptyDirectoryPruner();
  const stripper = new Stripper();
  const rehardlinker = new RehardLinker();
  const provided_programs: string[] = [];
  const shebangs: string[] = [];
  const lib_symlink_fixer = new LibrarySymlinkEnsurer();
  const rms: Path[] = [];

  const maybe_add_provided_path = (path: Path) => {
    switch (path.parent().basename()) {
      case "bin":
      case "sbin":
        provided_programs.push(path.basename());
    }
  };

  for await (
    const { name, isDirectory, isFile, isSymlink, ...entry } of walker
  ) {
    const path = new Path(entry.path);

    if (!process(path)) {
      continue;
    }

    if (isSymlink) {
      // fix absolute path symlinks
      const target = await Deno.readLink(path.string);
      if (target.startsWith(PKGX_DIR.string)) {
        const relative = new Path(target).relative({ to: path.parent() });
        path.rm();
        Deno.symlink(relative, path.string, { type: isFile ? "file" : "dir" });
      }

      maybe_add_provided_path(path);
    } else if (isFile) {
      if (!rehardlinker.push(path)) {
        // if rehardlinker returns false, it means we already saw this inode
        // so we can skip handling it again
        maybe_add_provided_path(path);
        continue;
      }

      switch (await mime(path)) {
        case "exe":
          rpather.push(path);
          stripper.push(path); //TODO no need to strip for same inode
          maybe_add_provided_path(path);
          lib_symlink_fixer.push(path);
          break;

        case "shebang":
          shebangs.push(path.string);
          break;

        default:
          switch (path.extname()) {
            case ".pc":
              {
                await fix_pkg_config_file(path, prefix, PKGX_DIR, original_PKGX_DIR);
              }
              break;
            case ".pyc":
            case ".la":
            case ".a": // static libs are not useful to our purposes
              console.error(`::warning file=${path}::pruning file:`, path);
              path.rm();
              //TODO need to update the empty dir pruner
              continue;
            case ".cmake":
              await fix_cmake_file(path, prefix);
              break;
          }
      }
    } else if (isDirectory && name.endsWith(".dSYM")) {
      rms.push(path);
    }

    pruner.add(new Path(path), {isDirectory, isSymlink});
  }

  for (const shebang of shebangs) {
    await fix_shebang(new Path(shebang), provided_programs);
  }

  stripper.execute(); // strip first as rpather codesigns and strip breaks codesigning
  lib_symlink_fixer.execute(); // needs to be before the rpath fixer due to fixing lib symlinks being relevant
  await rpather.execute();
  await rehardlinker.execute();
  await pruner.execute();

  // we have a “docs go on the Internet” policy
  prefix.join("share/doc").rm("rf");

  for (const byebye of rms) {
    byebye.rm("rf");
  }
}
