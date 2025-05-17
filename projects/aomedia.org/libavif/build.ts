import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/AOMediaCodec/libavif/archive/refs/tags/v${version}.tar.gz`);
  run`cmake
        -B bld
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DAVIF_CODEC_AOM=SYSTEM
        -DAVIF_BUILD_APPS=ON
        -DAVIF_BUILD_EXAMPLES=OFF
        -DAVIF_BUILD_TESTS=OFF
        -DAVIF_LIBYUV=OFF
        `;
  run`cmake --build bld --target install`;
}
