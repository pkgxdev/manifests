import { BuildOptions, unarchive, run, env_include } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.x.org/archive/individual/lib/xtrans-${tag}.tar.bz2`);
  env_include("x.org/util-macros");

  //   # otherwise X11 fails to build on all platforms we support at least lol
  //   sed -i.bak 's|# include <sys/stropts.h>|# include <sys/ioctl.h>|g' Xtranslcl.c

  run`./configure
        --prefix=${prefix}
        --sysconfdir=/etc
        --localstatedir=/var
        --disable-debug
        --enable-docs=no`;
  run`make --jobs=${navigator.hardwareConcurrency} install`;
}