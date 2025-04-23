import { BuildOptions, unarchive } from "brewkit";

export default async function({ prefix, version }: BuildOptions) {

  const arch = (() => {
    switch (Deno.build.target) {
      case "x86_64-unknown-linux-gnu":
        return "Linux_x86_64";
      case "aarch64-unknown-linux-gnu":
        return "Linux_arm64";
      case "x86_64-apple-darwin":
        return "Darwin_x86_64";
      case "aarch64-apple-darwin":
        return "Darwin_arm64";
      case "x86_64-pc-windows-msvc":
        return "Windows_x86_64";
      default:
        throw new Error(`Unsupported platform: ${Deno.build.target}`);
    }
  })();

  await unarchive(`https://github.com/charmbracelet/gum/releases/download/v${version}/gum_${version}_${arch}.tar.gz`)
  prefix.bin.install("gum");
}
