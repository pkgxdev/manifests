import { BuildOptions, env_include, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  if (Deno.build.os != 'windows') {
    await unarchive(`https://github.com/ninja-build/ninja/archive/refs/tags/${tag}.tar.gz`);

    run`./configure.py --bootstrap`;

    prefix.bin.install("ninja");
  } else {
    await unarchive(`https://github.com/ninja-build/ninja/releases/download/${tag}/ninja-win.zip`);
    prefix.bin.install("ninja.exe");
  }
}
