import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://pkgconfig.freedesktop.org/releases/${tag}.tar.gz`);

  Deno.env.set("CFLAGS", "-Wno-error=int-conversion");

  run`./configure
        --prefix=${prefix}
        --disable-debug
        --disable-host-tool
        --with-internal-glib  # glib depends on pkg-config TODO shouldn't be a problem for us tho
        --with-pc-path=${pc_path()}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}

function pc_path() {
  if (Deno.build.os == 'darwin') {
    return '/usr/lib/pkgconfig:/usr/local/lib/pkgconfig';
  } else {
    return '/usr/lib/pkgconfig:/usr/share/pkgconfig:/usr/local/lib/pkgconfig';
  }
}