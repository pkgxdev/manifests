import { BuildOptions, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  const arch = (() => {
    switch (`${Deno.build.os}/${Deno.build.arch}`) {
      case "darwin/x86_64":
        return "darwin-amd64.tar.gz";
      case "linux/x86_64":
        return "linux-amd64.tar.gz";
      case "windows/x86_64":
        return "windows-amd64.zip";
      case "linux/aarch64":
        return "linux-arm64.tar.gz";
      case "darwin/aarch64":
        return "darwin-arm64.tar.gz";
      default:
        throw new Error("Unsupported platform");
    }
  })();

  prefix.mkdir('p').cd();
  await unarchive(`https://go.dev/dl/go${tag}.${arch}`);
}
