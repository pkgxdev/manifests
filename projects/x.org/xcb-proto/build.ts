import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://xorg.freedesktop.org/archive/individual/proto/xcb-proto-${tag}.tar.gz`);
  run`./configure
        --prefix=${prefix}
        --sysconfdir=/etc
        --localstatedir=/var`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
