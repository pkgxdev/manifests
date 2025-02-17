import { BuildOptions, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/denoland/deno/releases/download/${tag}/deno-${Deno.build.target}.zip`);
  prefix.bin.install("deno");
}
