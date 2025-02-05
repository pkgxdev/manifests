import { walk as std_walk } from "jsr:@std/fs@1/walk";
import { basename } from "jsr:@std/path@1/basename";
import run, { backticks_quiet } from "./run.ts";
import Path from "./path.ts";

export default async function (prefix: Path) {
  const map: Record<string, string[]> = {};
  const basename_mapper: Record<string, Path> = {};

  for await (const entry of walk(prefix)) {
    map[entry] = get_linked_libs(entry);
    basename_mapper[basename(entry)] = new Path(entry).parent();
  }

  for (const [file, libs] of Object.entries(map)) {
    map[file] = libs.map((lib) => {
      const basename = basename_mapper[lib];
      if (basename) {
        return basename.relative({ to: new Path(file).parent() })
      } else {
        console.error(`::error::${lib} was not found in the rpath search list`);
      }
    });
  }

  for (let [file, rpaths] of Object.entries(map)) {
    rpaths = rpaths.uniq().map((rpath) => `$ORIGIN/${rpath || "."}`);
    if (rpaths.length) {
      run`patchelf --force-rpath --set-rpath ${rpaths.join(":")} ${file}`;
    }
  }
}

async function* walk(prefix: Path): AsyncGenerator<string> {
  for (const basename of ["bin", "lib", "libexec"]) {
    const d = prefix.join(basename).isDirectory();
    if (!d) continue;
    for await (
      const entry of std_walk(prefix.join(basename).string, {
        includeFiles: true,
        includeDirs: false,
      })
    ) {
      try {
        using file = await Deno.open(entry.path, { read: true });
        const buffer = new Uint8Array(4);
        await file.read(buffer);

        // Check for ELF (Linux/macOS) or Mach-O (macOS) headers
        if (
          buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c &&
          buffer[3] === 0x46
        ) {
          // ELF file (Linux/macOS executables and shared libraries)
          yield entry.path;
        } else if (
          (buffer[0] === 0xcf && buffer[1] === 0xfa && buffer[2] === 0xed &&
            buffer[3] === 0xfe) ||
          (buffer[0] === 0xca && buffer[1] === 0xfe && buffer[2] === 0xba &&
            buffer[3] === 0xbe)
        ) {
          // Mach-O file (macOS executables and shared libraries)
          yield entry.path;
        }
      } catch (error) {
        console.error(`::error::reading file ${entry.path}:`, error);
      }
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
