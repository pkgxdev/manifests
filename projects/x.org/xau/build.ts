import { env_include, BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://www.x.org/archive/individual/lib/libXau-${version}.tar.gz`);

  env_include("x.org/util-macros^1 x.org/protocol");

  run`./configure
        --prefix=${prefix}
        --sysconfdir=/etc
        --localstatedir=/var`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
