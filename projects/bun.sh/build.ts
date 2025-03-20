import { BuildOptions, Path, unarchive } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  const arch = (() => {
    switch (`${Deno.build.os}/${Deno.build.arch}`) {
      case "darwin/x86_64":
        return "darwin-x64";
      case "linux/x86_64":
        return "linux-x64";
      case "windows/x86_64":
        return "windows-x64";
      case "linux/aarch64":
        return "linux-aarch64";
      case "darwin/aarch64":
        return "darwin-aarch64";
      default:
        throw new Error("Unsupported platform");
    }
  })();

  await unarchive(`https://github.com/oven-sh/bun/releases/download/bun-v${version}/bun-${arch}.zip`);
  const exe = Deno.build.os == "windows" ? 'bun.exe' : 'bun';
  Path.cwd().join(`bun-${arch}`, exe).mv({ into: prefix.bin.mkdir('p') });
}
