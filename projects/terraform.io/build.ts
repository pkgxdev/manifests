import { BuildOptions, unarchive } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  switch (`${Deno.build.os}-${Deno.build.arch}`) {
    case "darwin-x86_64":
      await unarchive(`https://releases.hashicorp.com/terraform/${version}/terraform_${version}_darwin_amd64.zip`);
      break;
    case "darwin-aarch64":
      await unarchive(`https://releases.hashicorp.com/terraform/${version}/terraform_${version}_darwin_arm64.zip`);
      break;
    case "linux-x86_64":
      await unarchive(`https://releases.hashicorp.com/terraform/${version}/terraform_${version}_linux_amd64.zip`);
      break;
    case "linux-aarch64":
      await unarchive(`https://releases.hashicorp.com/terraform/${version}/terraform_${version}_linux_arm64.zip`);
      break;
  }
  prefix.bin.install("terraform");
}
