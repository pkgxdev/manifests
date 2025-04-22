import { BuildOptions, unarchive, run, env_include } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.x.org/archive/individual/lib/libX11-${version}.tar.gz`);

  env_include("x.org/protocol x.org/util-macros x.org/xtrans gnu.org/sed");

  let extra = '';
  if (Deno.build.os === "darwin") {
    // local transport doesn’t work on macOS, ask ChatGPT about it
    extra = '--disable-xlocal';
  }

  run`./configure
        --prefix=${prefix}
        --sysconfdir=/etc
        --localstatedir=/var
        --disable-debug
        --enable-unix-transport
        --enable-tcp-transport
        --enable-ipv6
        --enable-local-transport
        --enable-loadable-i18n
        --enable-xthreads
        --enable-specs=no
        ${extra}
      `;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
