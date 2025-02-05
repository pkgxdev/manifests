import { walk as std_walk } from "jsr:@std/fs@1/walk";
import { basename } from "jsr:@std/path@1/basename";
import run, { backticks_quiet } from "./run.ts";
import { fileTypeFromFile } from "npm:file-type";
import Path from "./path.ts";

export default async function (prefix: Path, deps_prefixes: Path[]) {
  const map: Record<string, string[]> = {};
  const basename_mapper: Record<string, Path> = {};

  for await (const entry of walk(prefix)) {
    map[entry] = get_linked_libs(entry);
    basename_mapper[basename(entry)] = new Path(entry).parent();
  }

  for (const prefix of deps_prefixes) {
    for await (const entry of walk(prefix)) {
      basename_mapper[basename(entry)] = new Path(entry).parent();
    }
  }

  for (const [file, libs] of Object.entries(map)) {
    map[file] = [];
    for (const lib of libs) {
      const basename = basename_mapper[lib];
      if (basename) {
        map[file].push(basename.relative({ to: new Path(file).parent() }));
      } else {
        console.error(`::error::${lib} was not found in the rpath search list`);
      }
    }
  }

  for (let [file, rpaths] of Object.entries(map)) {
    rpaths = rpaths.uniq().map((rpath) => `$ORIGIN/${rpath || "."}`);
    if (rpaths.length) {
      run`patchelf --force-rpath --set-rpath ${rpaths.join(":")} ${file}`;
    }
  }
}

async function* walk(prefix: Path): AsyncGenerator<string> {
  for await (
    const entry of std_walk(prefix.string, {
      includeFiles: true,
      includeDirs: false,
    })
  ) {
    const type = await fileTypeFromFile(entry.path);
    switch (type?.mime) {
      case "application/x-elf":
        yield entry.path;
        break;
    }
  }
}

function get_linked_libs(file: string): string[] {
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
        break;
      default:
        libs.push(lib);
    }
  }
  return libs;
}

declare global {
  interface Array<T> {
    uniq(): Array<T>;
  }
}

Array.prototype.uniq = function <T>(this: Array<T>): Array<T> {
  const seen = new Set<T>();
  return this.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
};
