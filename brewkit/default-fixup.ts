import { basename, fromFileUrl } from "jsr:@std/path@^1";
import { backticks_quiet, Path, run } from "brewkit";
import fix_shebang from "./fix-shebang.ts";
import { walk } from "jsr:@std/fs@1/walk";

//TODO keep a list of inodes
// * don’t repeat work already done on a hardlink to another files
// * re-hardlink at end of fixups

export default async function default_fixups(
  prefix: Path,
  deps: {
    PKGX_DIR: Path;
    prefixes: Path[];
  },
  PKGX_DIR: Path,
) {
  let walker = walk(prefix.string, {
    includeFiles: true,
    includeDirs: true,
    includeSymlinks: false,
  });

  const rpather = new RpathFixer(prefix, deps, PKGX_DIR);
  const pruner = new EmptyDirectoryPruner();
  const to_strip: Path[] = [];
  const provided_programs: string[] = [];
  const shebangs: string[] = [];

  for await (const { name, isDirectory, isFile, ...entry } of walker) {
    const path = new Path(entry.path);

    if (isFile) {
      switch (await mime(path)) {
        case "exe":
          rpather.push(path);
          to_strip.push(path);

          switch (path.parent().basename()) {
            case "bin":
            case "sbin":
              provided_programs.push(path.basename());
          }
          break;

        case "shebang":
          shebangs.push(path.string);
          break;

        default:
          switch (path.extname()) {
            case ".pc":
              await fix_pkg_config_file(path, prefix);
              break;
            case ".la":
              console.error("::warning::deleting libtool archive:", path);
              path.rm();
              continue;
            case "cmake":
              await fix_cmake_file(path, prefix);
              break;
          }
      }
    }

    pruner.add(path, isDirectory);
  }

  for (const shebang of shebangs) {
    await fix_shebang(new Path(shebang), provided_programs);
  }

  // strip before rpath fixing due to the need to re-codesign on macOS
  // and the rpather re-codesigns at the end
  for (const path of to_strip) {
    switch (path.extname()) {
      case ".dylib":
        // breaks things like python if we do this
        // run`strip -x ${path}`;
        break;
      default:
        run`strip ${path}`;
        break;
      case ".so":
      case ".o":
        // cannot strip these, you always lose needed symbols
    }
  }

  await rpather.execute();
  await pruner.execute();

  walker = walk(prefix.string, {
    includeFiles: true,
    includeDirs: true,
    includeSymlinks: false,
  });
  for await (const { path } of walker) {
    if (path != prefix.string) {
      make_readonly(path);
    }
  }
}

class RpathFixer {
  map: Record<string, string[]> = {};
  basename_mapper: Record<string, Path> = {};
  files: string[] = [];
  deps: {
    PKGX_DIR: Path;
    prefixes: Path[];
  };
  prefix: Path;
  PKGX_DIR: Path;

  constructor(prefix: Path, deps: {
    PKGX_DIR: Path;
    prefixes: Path[];
  }, PKGX_DIR: Path) {
    this.deps = deps;
    this.prefix = prefix;
    this.PKGX_DIR = PKGX_DIR;
  }

  push(path: Path) {
    this.map[path.string] = get_linked_libs(path);
    this.basename_mapper[path.basename()] = path.parent();
  }

  async execute() {
    for (const prefix of this.deps.prefixes) {
      const walker = walk(prefix.string, {
        includeFiles: true,
        includeDirs: false,
        includeSymlinks: false,
      });
      for await (const { path } of walker) {
        if (await mime(path) == "exe") {
          /// because we build into a separate PKGX_DIR to where the deps are sigh
          const mangled_path = this.PKGX_DIR.join(
            new Path(path).relative({ to: this.deps.PKGX_DIR }),
          );
          this.basename_mapper[basename(path)] = mangled_path.parent();
        }
      }
    }

    for (const [file, libs] of Object.entries(this.map)) {
      this.map[file] = [];
      for (const lib of libs) {
        const basename = this.basename_mapper[lib];
        if (basename) {
          this.map[file].push(
            basename.relative({ to: new Path(file).parent() }),
          );
        } else {
          console.error(
            `::error::${lib} was not found in the rpath search list`,
          );
        }
      }
    }

    switch (Deno.build.os) {
      case "linux":
        for (let [file, rpaths] of Object.entries(this.map)) {
          rpaths = rpaths.uniq().map((rpath) => `$ORIGIN/${rpath || "."}`);
          if (rpaths.length) {
            run`patchelf --force-rpath --set-rpath ${rpaths.join(":")} ${file}`;
          }
        }
        break;
      case "darwin": {
        const script = new Path(fromFileUrl(import.meta.url)).parent().join(
          "scripts/fix-macho.rb",
        );
        Deno.env.set("GEM_HOME", "/tmp/gem");
        for (const key of Object.keys(this.map)) {
          Deno.env.set("PKGX_DEPS_MAP", JSON.stringify(this.basename_mapper));
          run`${script} ${key} ${this.prefix} ${this.PKGX_DIR}`;
        }
      }
    }
  }
}

function get_linked_libs(file: Path): string[] {
  switch (Deno.build.os) {
    case "linux":
      return ldd(file);
  }
  return [];
}

function ldd(file: Path) {
  const libs: string[] = [];
  const output = backticks_quiet`ldd ${file}`;
  for (const line of output.split("\n")) {
    if (!line.includes("=>")) continue;
    const [lib] = line.trim().split(/\s+/);
    switch (basename(lib.replace(/\.\d+$/, ""))) {
      case "linux-vdso.so":
      case "libdl.so":
      case "libpthread.so":
      case "libc.so":
      case "librt.so":
        break;
      default:
        libs.push(lib);
    }
  }
  return libs;
}

class EmptyDirectoryPruner {
  candidates: Set<string> = new Set();

  add(p: Path, isDirectory: boolean) {
    if (!isDirectory) {
      while (p = p.parent(), p.string != "/") {
        this.candidates.delete(p.string);
      }
    } else {
      this.candidates.add(p.string);
    }
  }

  async execute() {
    for (const dir of this.candidates) {
      Deno.remove(dir);
    }
  }
}

async function make_readonly(path: string) {
  const fileInfo = await Deno.stat(path);
  if (fileInfo.mode) {
    const newMode = fileInfo.mode & ~0o222; // remove write permissions
    Deno.chmod(path, newMode);
  }
}

async function mime(path: Path | string) {
  using file = await Deno.open(path instanceof Path ? path.string : path);
  const buff = new Uint8Array(4);
  await file.read(buff);

  const check = (...bytes: number[]) => {
    return bytes.every((byte, index) => buff[index] === byte);
  };

  // first is elf, second is macho
  if (check(0x7F, 0x45, 0x4C, 0x46) || check(0xCF, 0xFA, 0xED, 0xFE)) {
    return "exe";
  } else if (check(0x23, 0x21)) {
    return "shebang";
  }
}

async function fix_pkg_config_file(path: Path, install_prefix: Path) {
  const orig = await path.read();
  const relative_path = install_prefix.relative({ to: path.parent() });
  const text = orig.replaceAll(
    install_prefix.string,
    `\${pcfiledir}/${relative_path}`,
  );
  if (orig !== text) {
    console.log("%c+", "color:yellow", "fixing:", path);
    path.write({ text, force: true });
  }
}

async function fix_cmake_file(path: Path, install_prefix: Path) {
  // Facebook and others who use CMake sometimes rely on a libary's .cmake files
  // being shipped with it. This would be fine, except they have hardcoded paths.
  // But a simple solution has been found.
  const orig = await path.read();
  const relative_path = install_prefix.relative({ to: path.parent() });
  const text = orig.replaceAll(
    install_prefix.string,
    `\${CMAKE_CURRENT_LIST_DIR}/${relative_path}`,
  );
  if (orig !== text) {
    console.error("%c+", "color:yellow", "fixing:", path);
    path.write({ text, force: true });
  }
}
