import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://www.mpg123.de/download/mpg123-${version}.tar.bz2`);
  let extra = Deno.build.os == 'darwin' ? '--with-default-audio=coreaudio' : '';
  run`./configure
        --disable-debug
        --disable-dependency-tracking
        --prefix=${prefix}
        --with-module-suffix=.so
        --enable-static
        ${extra}`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}