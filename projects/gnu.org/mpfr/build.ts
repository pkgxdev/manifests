import { BuildOptions, env_include, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/mpfr/mpfr-${tag}.tar.gz`);

  env_include("gnu.org/gmp"); // statically linked on linux

  run`./configure --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
