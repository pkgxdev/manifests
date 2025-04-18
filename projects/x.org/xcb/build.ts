import { BuildOptions, unarchive, run, SemVer } from "brewkit";
import env_include from "../../../brewkit/env-include.ts";

export default async function ({ prefix, version, tag, props }: BuildOptions) {
  await unarchive(`https://xcb.freedesktop.org/dist/libxcb-${tag}.tar.gz`);
  if (version.lt(new SemVer("1.16"))) {
    run`patch -p1 --input ${props}/configure.patch`;
  }
  env_include("x.org/xcb-proto");
  run`./configure
        --prefix=${prefix}
        --sysconfdir=/etc
        --localstatedir=/var
        --enable-dri3
        --enable-ge
        --enable-xevie
        --enable-xprint
        --enable-selinux
        --disable-silent-rules
        --enable-devel-docs=no
        --with-doxygen=no`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
