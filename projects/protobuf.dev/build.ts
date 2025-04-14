import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/protocolbuffers/protobuf/archive/refs/tags/${tag}.tar.gz`);
  run`cmake
        -B bld
        -Dprotobuf_BUILD_LIBPROTOC=ON
        -Dprotobuf_BUILD_SHARED_LIBS=ON
        -Dprotobuf_INSTALL_EXAMPLES=OFF
        -Dprotobuf_BUILD_TESTS=OFF
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DCMAKE_BUILD_TYPE=Release
        -Dprotobuf_ABSL_PROVIDER=package`;
  run`cmake --build bld --target install`;
// env:
//   linux:
//     LDFLAGS: '$LDFLAGS -Wl,--allow-shlib-undefined'
//   ARGS:
//     - '-Dprotobuf_BUILD_LIBPROTOC=ON'
//     - '-Dprotobuf_BUILD_SHARED_LIBS=ON'
//     - '-Dprotobuf_INSTALL_EXAMPLES=OFF'
//     - '-Dprotobuf_BUILD_TESTS=OFF'
//     - '-DCMAKE_INSTALL_PREFIX={{prefix}}'
//     - '-DCMAKE_BUILD_TYPE=Release'
//     - '-Dprotobuf_ABSL_PROVIDER=package'
//     - '-DCMAKE_PREFIX_PATH={{deps.abseil.io.prefix}}'
}