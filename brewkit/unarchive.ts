import { Path } from "brewkit";
import { fromFileUrl } from "jsr:@std/path@1/from-file-url";
import { basename } from "node:path";

export default async function (
  url: string,
  stripComponents = 1,
): Promise<void> {
  console.error("%c+", "color:yellow", "unarchiving:", url);

  if (url.endsWith(".zip")) {
    const tmp = new Path(Deno.makeTempFileSync());
    const rsp = await fetch(url);
    if (!rsp.ok) {
      console.error("%cerror", "color:red", "failed to download:", url);
      Deno.exit(1);
    }
    using file = await Deno.open(tmp.string, { write: true, create: true });
    await rsp.body!.pipeTo(file.writable);

    await new Deno.Command("unzip", {
      args: [tmp.string],
      stdin: "piped",
    }).spawn().status;
  } else {
    const mode = url.endsWith(".bz2") ? "xjf" : url.endsWith(".xz") ? "xJf" : "xzf";
    const tar = new Deno.Command("tar", {
      args: [mode, "-", `--strip-components=${stripComponents}`],
      stdin: "piped",
    }).spawn();

    const input = await (async () => {
      const root = new Path(fromFileUrl(import.meta.url)).join("../../srcs");
      const base = new Path(new URL(url).pathname).basename();
      const predownloaded_file = root.join(base).isReadableFile();

      if (!predownloaded_file) {
        const rsp: Response = await fetch(url);
        if (!rsp.ok) {
          console.error("::error::failed to download:", url);
          Deno.exit(1);
        }
        if (!Deno.env.get("CI")) {
          using file = await Deno.open(root.mkdir().join(basename(url)).string, { write: true, create: true });
          const [body1, body2] = rsp.body!.tee();
          await body1.pipeTo(file.writable);
          return body2;
        } else {
          return rsp.body!;
        }
      } else {
        console.error(
          "%cℹ︎",
          "color:blue",
          "using pre-download:",
          predownloaded_file.relative({ to: root }),
        );
        const file = await Deno.open(predownloaded_file.string, { read: true });
        return file.readable;
      }
    })();

    const [_, { success }] = await Promise.all([
      input.pipeTo(tar.stdin),
      tar.status,
    ]);
    if (!success) {
      console.error("%cerror", "color:red", "download and/or unarchive failed");
      Deno.exit(1);
    }
  }
}
