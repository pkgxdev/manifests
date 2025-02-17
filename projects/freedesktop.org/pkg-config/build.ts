import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://pkgconfig.freedesktop.org/releases/${tag}.tar.gz`);

  Deno.env.set("CFLAGS", "-Wno-error=int-conversion");

  run`./configure
        --prefix=${prefix}
        --disable-debug
        --disable-host-tool
        --with-internal-glib
        --with-pc-path=/usr/lib/pkgconfig:/usr/share/pkgconfig:/usr/local/lib/pkgconfig`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
