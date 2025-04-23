import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ffmpeg.org/releases/ffmpeg-${tag}.tar.gz`);
  // Deno.env.set("CFLAGS", "-Wno-incompatible-function-pointer-types");
  run`./configure
        --prefix=${prefix}
        --enable-shared
        --enable-gpl
        --enable-libfreetype
        --enable-libfribidi
        --enable-libmp3lame
        --enable-libharfbuzz
        --enable-libx264
        --enable-libx265
        --enable-libvpx
        --enable-libopus
        --enable-libwebp
        --enable-libass
  `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;
}