import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/libidn/libidn2-${tag}.tar.gz`);
  // dependencies:
//   gnu.org/texinfo: '*'

  run`./configure --prefix=${prefix} --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}