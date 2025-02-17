import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/m4/m4-${version}.tar.gz`);
  run`./configure --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
