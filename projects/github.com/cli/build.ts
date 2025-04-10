import { unarchive, BuildOptions, Path } from "brewkit";

export default async function build({ prefix, version, tag }: BuildOptions) {
  const url = `https://github.com/cli/cli/releases/download/${tag}/gh_${version}_${platform()}.zip`;
  await unarchive(url, { stripComponents: 1 });
  Path.cwd().mv({ to: prefix.mkparent() });
}

function platform() {
  switch (`${Deno.build.os}/${Deno.build.arch}`) {
    case "darwin/aarch64":
      return "macOS_arm64";
    case "linux/x86_64":
      return "linux_amd64";
    case "windows/x86_64":
      return "windows_amd64";
    default:
      throw new Error(`Unsupported platform: ${Deno.build.os}/${Deno.build.arch}`);
  }
}
