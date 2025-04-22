import { BuildOptions, unarchive, run } from "brewkit";
import env_include from "../../../brewkit/env-include.ts";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.x.org/archive/individual/lib/libXdmcp-${version}.tar.gz`);

  env_include("x.org/protocol");

  run`./configure
       --prefix=${prefix}
       --sysconfdir=/etc
       --localstatedir=/var
       --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
