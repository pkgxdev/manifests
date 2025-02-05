import { fromFileUrl } from "jsr:@std/path@^1.0.8";
import fixup_elf from "./fix-elf.ts";
import Path from "./path.ts";

export default async function fixup(path: Path, PKGX_DIR: Path) {
  console.error("%c+", "color:yellow", "fixing up:", path.string);

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
}
