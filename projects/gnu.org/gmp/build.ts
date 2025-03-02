import { BuildOptions, ensure, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/gmp/gmp-${tag}.tar.bz2`);

  ensure("m4");

  run`./configure
        --enable-cxx
        --with-pic
        --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make --jobs ${navigator.hardwareConcurrency} check`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
