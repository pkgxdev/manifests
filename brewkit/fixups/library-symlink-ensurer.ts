import { Path } from "brewkit";

export default class LibrarySymlinkEnsurer {
  files: Path[] = [];

  push(file: Path) {
    switch (Deno.build.os) {
      case "linux":
        if (file.basename().startsWith("lib") && /\.so(\.\d+)*$/.test(file.string)) {
          this.files.push(file);
        }
        break;
      case "darwin":
        if (file.basename().startsWith("lib") && file.extname() == ".dylib") {
          this.files.push(file);
        }
        break;
    }
  }

  execute() {
    for (const file of this.files) {
      switch (Deno.build.os) {
        case "linux":
          const match = file.basename().match(/(.*\.so)((\.\d+)\.\d+)\.\d+$/);
          if (!match) {
            console.error(`::warning file=${file}::library symlink should have version in name`);
            continue;
          }

          const base = match[1];
          symlink_if_needed(file, `${base}`);
          symlink_if_needed(file, `${base}${match[2]}`);
          symlink_if_needed(file, `${base}${match[3]}`);
          break;
      }
    }
  }
}

function symlink_if_needed(file: Path, basename: string) {
  //TODO check realpath
  const newpath = file.parent().join(basename);
  if (!newpath.isSymlink()) {
    newpath.ln("s", { target: file.basename() });
  }
}
