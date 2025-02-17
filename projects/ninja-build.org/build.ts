import { BuildOptions, env_include, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/ninja-build/ninja/archive/refs/tags/${tag}.tar.gz`);

  if (Deno.build.os != "darwin") {
    await env_include("python^3");
  }

  run`./configure.py --bootstrap`;

  prefix.bin.install("ninja");
}
