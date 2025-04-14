import { BuildOptions, unarchive, run, inreplace } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/abseil/abseil-cpp/archive/refs/tags/${tag}.tar.gz`);

  run`cmake
        -B bld
        -DCMAKE_CXX_STANDARD=17
        -DBUILD_SHARED_LIBS=ON
        -DCMAKE_INSTALL_RPATH=${prefix}/lib
        -DCMAKE_BINARY_DIR=${prefix}/bin
        -DABSL_PROPAGATE_CXX_STD=ON
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DCMAKE_INSTALL_LIBDIR=${prefix}/lib
        -DCMAKE_BUILD_TYPE=Release
        -DCMAKE_FIND_FRAMEWORK=LAST
        -DCMAKE_VERBOSE_MAKEFILE=ON
        -Wno-dev
        -DBUILD_TESTING=OFF`;
  run`cmake --build bld --target install`;
}
