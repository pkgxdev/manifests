import { env_include, BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.x.org/archive/individual/lib/libXScrnSaver-${version}.tar.gz`);
  env_include("x.org/protocol x.org/xcb^1.17");
  run`./configure
        --prefix=${prefix}
        --sysconfdir=/etc'
        --localstatedir=/var'
        --enable-spec=no`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
