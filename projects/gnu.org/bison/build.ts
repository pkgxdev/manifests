import { BuildOptions, run, unarchive } from "brewkit";
import env_include from "../../../brewkit/env-include.ts";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/bison/bison-${tag.slice(1)}.tar.xz`);

  if (Deno.build.os != "darwin") {
    env_include("gnu.org/m4");
  }

  run`./configure --prefix=${prefix} --enable-relocatable`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
