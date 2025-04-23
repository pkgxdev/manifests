import { env_include, BuildOptions, ensure, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/gmp/gmp-${tag}.tar.bz2`);

  ensure("m4");

  let extra = "";
  if (Deno.build.os == 'linux') {
    // is c++ so we need libstdc++.so
    env_include("gnu.org/gcc");
    extra = "--disable-shared";
  }

  run`./configure
        --enable-cxx
        --with-pic
        --prefix=${prefix}
        ${extra}`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make --jobs ${navigator.hardwareConcurrency} check`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
