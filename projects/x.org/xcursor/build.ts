import { BuildOptions, unarchive, run, env_include } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.x.org/archive/individual/lib/libXcursor-${version}.tar.xz`);

  env_include("x.org/protocol");

  run`./configure
        --prefix=${prefix}
        --sysconfdir=/etc
        --localstatedir=/var
        --disable-dependency-tracking
        --disable-silent-rules`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
