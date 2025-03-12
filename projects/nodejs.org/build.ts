import { BuildOptions, ensure, env_include, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://nodejs.org/dist/${tag}/node-${tag}.tar.gz`);

  if (Deno.build.os == "windows") {
    return run`.\\vcbuild`;
  }

  if (Deno.build.os == "linux") {
    // node^22 needs a newer libstdc++ than we provide
    // gcc provides it as a static library
    env_include("gnu.org/gcc");
  }

  run`./configure --prefix=${prefix} --shared-openssl --shared-zlib --ninja --enable-lto`;
  run`make install`;  // runs ninja (much faster) via make
}
