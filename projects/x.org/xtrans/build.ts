import { BuildOptions, unarchive, run, env_include, inreplace } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.x.org/archive/individual/lib/xtrans-${tag}.tar.bz2`);

  env_include("x.org/util-macros x.org/protocol");

  if (Deno.build.os === "darwin") {
    // or fails to build because of missing sys/stropts.h
    inreplace("Xtranslcl.c", /#\s*include <sys\/stropts.h>/, "#include <sys/ioctl.h>");
  }

  run`./configure
        --prefix=${prefix}
        --sysconfdir=/etc
        --localstatedir=/var
        --disable-debug
        --enable-docs=no`;
  run`make --jobs=${navigator.hardwareConcurrency} install`;
}