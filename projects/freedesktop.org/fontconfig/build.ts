import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.freedesktop.org/software/fontconfig/release/fontconfig-${version}.tar.xz`);
  run`./configure --prefix=${prefix} --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install RUN_FC_CACHE_TEST=false`;
  prefix.join("share/doc").rm('rf');

//      sed -i 's|<cachedir>{{prefix}}/var/cache/fontconfig</cachedir>|<cachedir
//     prefix="relative">../../var/cache/fontconfig</cachedir>|'
//     {{prefix}}/etc/fonts/fonts.conf
}