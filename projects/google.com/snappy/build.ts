import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/google/snappy/archive/refs/tags/${version}.tar.gz`);
// script:
//   - 'sed -i -e ''s/ -Werror//g'' -e ''/# Disable RTTI./{N;N;d;}'' CMakeLists.txt'
  run`cmake
        -B bld
        -DBUILD_SHARED_LIBS=ON
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DSNAPPY_BUILD_TESTS=OFF
        -DSNAPPY_BUILD_BENCHMARKS=OFF`;
  run `cmake --build bld --target install`;
}
