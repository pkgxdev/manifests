import { env_include, BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://xorg.freedesktop.org/archive/individual/proto/xorgproto-${tag}.tar.gz`);

  env_include("x.org/util-macros^1");

  run`./configure
        --prefix=${prefix}
        --sysconfdir=/etc
        --localstatedir=/var`;
   run`make --jobs ${navigator.hardwareConcurrency} install`;
}