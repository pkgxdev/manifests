import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/gawk/gawk-${tag}.tar.gz`);

  run`./configure --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
  run`make test`;
}
