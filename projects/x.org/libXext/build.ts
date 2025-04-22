import { BuildOptions, unarchive, run, env_include } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://www.x.org/archive/individual/lib/libXext-${version}.tar.gz`);

  env_include("x.org/protocol");
  run`./configure
        --prefix=${prefix}
        --sysconfdir=/etc
        --localstatedir=/var
        --enable-spec=no`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
