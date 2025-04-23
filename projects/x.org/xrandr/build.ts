import { env_include, BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.x.org/archive/individual/lib/libXrandr-${version}.tar.xz`);

  env_include("x.org/protocol");

  run`./configure
        --prefix=${prefix}
        --disable-dependency-tracking
        --disable-silent-rules
        --sysconfdir=/etc
        --localstatedir=/var`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
