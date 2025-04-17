import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://ffmpeg.org/releases/ffmpeg-${tag}.tar.gz`);
  // Deno.env.set("CFLAGS", "-Wno-incompatible-function-pointer-types");
  run`./configure
        --prefix=${prefix}
        --enable-libfreetype
        --enable-libfribidi
        --enable-libmp3lame
        --enable-shared
        --enable-libx264
        --enable-gpl
        --enable-libx265
        --enable-libvpx
      # --enable-libopus
        --enable-libwebp
  `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;
}