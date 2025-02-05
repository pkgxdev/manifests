import { Path } from "brewkit";
import { toNamespacedPath } from "node:path";

export default async function (
  url: string,
  stripComponents = 1,
): Promise<void> {
  console.error("%c+", "color:yellow", "unarchiving:", url);

  if (url.endsWith(".zip")) {
    const tmp = new Path(Deno.makeTempFileSync());
    const rsp = await fetch(url);
    using file = await Deno.open(tmp.string, { write: true, create: true });
    await rsp.body!.pipeTo(file.writable);

    await new Deno.Command("unzip", {
      args: [tmp.string],
      stdin: "piped",
    }).spawn().status;
  } else {
    const mode = url.endsWith(".bz2")
      ? "xjf"
      : url.endsWith(".xz")
      ? "xJf"
      : "xzf";
    const tar = new Deno.Command("tar", {
      args: [mode, "-", `--strip-components=${stripComponents}`],
      stdin: "piped",
    }).spawn();
    const rsp: Response = await fetch(url);
    const [_, {success}] = await Promise.all([rsp.body!.pipeTo(tar.stdin), tar.status]);
    if (!success) {
      console.error("download and/or unarchive failed");
      Deno.exit(1);
    }
  }
}
