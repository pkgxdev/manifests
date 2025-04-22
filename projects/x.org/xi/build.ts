import { BuildOptions, unarchive, run, env_include } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.x.org/archive/individual/lib/libXi-${version}.tar.xz`);

  env_include("x.org/protocol");

  run`./configure
        --prefix=${prefix}
        --disable-dependency-tracking
        --disable-silent-rules
        --sysconfdir=/etc
        --localstatedir=/var
        --enable-docs=no
        --enable-specs=no
        `;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
