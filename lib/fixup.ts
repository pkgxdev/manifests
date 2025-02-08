import { fromFileUrl } from "jsr:@std/path@^1.0.8";
import fixup_elf from "./fix-elf.ts";
import Path from "./path.ts";

export default async function fixup(path: Path, PKGX_DIR: Path) {
  if (Deno.env.get("GITHUB_ACTIONS")) {
    console.log("::group::fixups");
  } else {
    console.error("%c+", "color:yellow", "fixing up:", path.string);
  }

  switch (Deno.build.os) {
    case "darwin":
      {
        const bindir = new Path(fromFileUrl(import.meta.url)).parent().parent()
          .join("bin/private");
        const dirs = ["bin", "sbin", "tbin", "lib", "libexec"].map((x) =>
          path.join(x).isDirectory()?.string
        ).filter((x) => x) as string[];
        const proc = new Deno.Command(
          bindir.join("fix-machos.rb").string,
          {
            args: [path.string, PKGX_DIR.string, ...dirs],
            env: {
              GEM_HOME: PKGX_DIR.join("gem").string,
            },
          },
        ).spawn();
        const { success } = await proc.status;
        if (!success) {
          console.error("fix-machos failed");
          Deno.exit(1);
        }
      }
      break;

    case "linux":
      //TODO need to pass deps paths
      await fixup_elf(path, [path.string]);
      break;

    case "windows":
      break;
  }

  if (Deno.env.get("GITHUB_ACTIONS")) {
    console.log("::endgroup::");
  }
}

import { walk as std_walk } from "jsr:@std/fs@1/walk";

type FixupType = 'shebang' | 'binary'

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

        if (buffer[0] === 35 && buffer[1] === 33) {
          yield entry.path;
        }

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