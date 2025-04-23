import { BuildOptions, env_include, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/bison/bison-${tag.slice(1)}.tar.gz`);

  // for fuck knows reasons this is required or the resulting bison on linux
  // fails in use
  Deno.env.set("M4", "m4");

  run`./configure --prefix=${prefix} --enable-relocatable --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
