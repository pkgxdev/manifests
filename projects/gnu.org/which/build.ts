import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/which/which-${tag}.tar.gz`);
  run`./configure
          --prefix=${prefix}
          --disable-debug
          --disable-silent-rules
          --disable-dependency-tracking`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
