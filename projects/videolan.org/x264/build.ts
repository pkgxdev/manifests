import { run, env_include } from "brewkit";

export default async function (opts: any) {
  run`git clone https://code.videolan.org/videolan/x264.git .`;
  run`git reset --hard ${opts.sha}`;

  run`./configure
        --prefix=${opts.prefix}
        --disable-lsmash
        --disable-swscale
        --disable-ffms
        --enable-shared
        --enable-static
        --enable-strip`;

  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
