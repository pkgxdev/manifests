import { BuildOptions, unarchive, run } from "brewkit";
import env_include from "../../../brewkit/env-include.ts";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://gnupg.org/ftp/gcrypt/libassuan/libassuan-${version}.tar.bz2`);

  run`./configure --prefix=${prefix} --disable-debug`;
  run`make`;
  run`make check`;
  run`make install`;
}
