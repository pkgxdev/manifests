import { BuildOptions, run, unarchive } from "brewkit";
import env_include from "../../brewkit/env-include.ts";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/ninja-build/ninja/archive/refs/tags/${tag}.tar.gz`);

  if (Deno.build.os != "darwin") {
    await env_include("python^3");
  }

  run`./configure.py --bootstrap`;

  prefix.bin.install("ninja");
}
