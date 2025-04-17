import { env_include, BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/webmproject/libvpx/archive/refs/tags/${tag}.tar.gz`);
  env_include("tortall.net/yasm");
  run`./configure
        --prefix=${prefix}
        --disable-dependency-tracking
        --disable-examples
        --disable-unit-tests
        --enable-pic
        --enable-shared
        --enable-vp9-highbitdepth`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
