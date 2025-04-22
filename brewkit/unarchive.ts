import { fromFileUrl, basename } from "jsr:@std/path@1";
import { active_pkg, Path, platform_partial_path } from "brewkit";
import { crc32 } from "https://deno.land/x/crc32/mod.ts";

export default async function (
  url: string,
  opts: {stripComponents?: number} = {stripComponents: url.endsWith(".zip") ? undefined : 1},
): Promise<void> {
  console.error("%c+", "color:yellow", "unarchiving:", url);
  const { stripComponents } = opts;

  const root = new Path(fromFileUrl(import.meta.url)).join("../../artifacts/archives").mkdir('p');
  const ext = Path.root.join(basename(url)).extname();
  const checksum = crc32(url);
  const predownloaded_file = root.join(`${checksum}${ext}`);

  const input = await (async () => {
    if (!predownloaded_file.isFile()) {
      const rsp: Response = await fetch(url, { headers: {"User-Agent": "pkgx/manifests"} });
      if (!rsp.ok) {
        throw new Error("failed to connect to host");
      }
      using file = await Deno.open(predownloaded_file.string, { write: true, create: true });
      const [body1, body2] = rsp.body!.tee();
      await body1.pipeTo(file.writable);
      return body2;
    } else {
      console.error(
        "%ci",
        "color:blue",
        "nice. already downloaded:",
        predownloaded_file.relative({ to: root }),
      );
      const file = await Deno.open(predownloaded_file.string);
      return file.readable;
    }
  })();

  if (!url.endsWith(".zip")) {
    const [cmd, ...args] = mktar(url, stripComponents);

    const tar = new Deno.Command(cmd, {
      args: args,
      stdin: "piped",
    }).spawn();
    const [_, { success }] = await Promise.all([
      input.pipeTo(tar.stdin),
      tar.status,
    ]);
    if (!success) {
      throw new Error("unarchive failed");
    }
  } else if (Deno.build.os == "windows") {
    // on windows the tar is bsdtar which can extract zip files
    await input.getReader().read(); //FIXME inefficient for predownloaded case
    const args = ["xzf", predownloaded_file.string];
    if (stripComponents) args.push(`--strip-components=${stripComponents}`);
    const { success } = await new Deno.Command("tar", { args }).spawn().status;
    if (!success) {
      throw new Error("unarchive failed");
    }
  } else {
    await input.getReader().read(); //FIXME inefficient for predownloaded case
    const { success } = await new Deno.Command("unzip", {
      args: [predownloaded_file.string],
      stdin: "piped",
    }).spawn().status;
    if (!success) {
      throw new Error("unarchive failed");
    }

    if (stripComponents) {
      if (stripComponents != 1) throw new Error("only supporting 1 strip component for zips! please fix!");
      for await (const [path, {isDirectory}] of Path.cwd().ls()) {
        if (isDirectory) {
          for await (const [inner_path] of path.ls()) {
            inner_path.mv({ into: Path.cwd() });
          }
        }
        path.rm();
      }
    }

  }

  // make user accessible symlink
  if (Deno.build.os != 'windows' && predownloaded_file.isFile() && active_pkg) {
    root.parent().join(platform_partial_path(), active_pkg.project).mkdir('p').join(`v${active_pkg.version}+${checksum}${ext}`).rm().ln('s', {target: predownloaded_file});
  }
}

function mktar(url: string, stripComponents?: number) {
  const mode = url.endsWith(".bz2") ? "xjf" : url.endsWith(".xz") ? "xJf" : "xzf";
  switch (Deno.build.os) {
  case "windows":
  case "linux": {
    // we use the system tar for efficiency and because on Windows
    // we couldn’t get ours to work (at least when we wrote this code)
    // and because on windows the tar.exe is bsdtar which can extract zip files
    const rv = ["pkgx", "--quiet"];
    if (mode == "xJf") rv.push("+xz");
    if (mode == "xjf") rv.push("+bzip2");
    rv.push("--", "tar", mode, "-");
    if (stripComponents) rv.push(`--strip-components=${stripComponents}`);
    return rv;
  }
  case "darwin":
    // somehow the macOS tar can extract tar.xz files without assistance
    // even though there is no liblzma installed
    const rv = ["tar", mode, "-"];
    if (stripComponents) rv.push(`--strip-components=${stripComponents}`);
    return rv;
  default:
    throw new Error("unsupported platform");
  }
}
