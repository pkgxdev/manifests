import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/google/highway/archive/refs/tags/${version}.tar.gz`);
  run`cmake
        -B bld
        -DBUILD_SHARED_LIBS=ON
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DHWY_ENABLE_TESTS=OFF
        -DHWY_ENABLE_EXAMPLES=OFF
        -DCMAKE_BUILD_TYPE=Release
        `;
  run`cmake --build bld --target install`;

//   linux/x86-64:
//     ARGS:
//       - '-DCMAKE_EXE_LINKER_FLAGS=-Wl,--allow-shlib-undefined'
}