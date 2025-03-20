import { BuildOptions, env_include, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/libiconv/libiconv-${tag}.tar.gz`);

  if (Deno.build.os == 'linux') {
    env_include("gnu.org/gcc");
  }

  run`./configure
        --prefix=${prefix}
        --disable-debug
        --disable-dependency-tracking
        --enable-extra-encodings
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;
}
