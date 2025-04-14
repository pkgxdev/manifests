import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/bash/bash-${tag}.tar.gz`);
  Deno.env.set("CFLAGS", "-DSSH_SOURCE_BASHRC -Wno-implicit-function-declaration");
  run`./configure --prefix=${prefix} --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
