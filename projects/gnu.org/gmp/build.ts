import { BuildOptions, env_include, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://gmplib.org/download/gmp/${tag}.tar.bz2`);

  if (Deno.build.os != "darwin") {
    env_include("gnu.org/m4");
  }

  run`./configure
        --enable-cxx
        --with-pic
        --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make --jobs ${navigator.hardwareConcurrency} check`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
