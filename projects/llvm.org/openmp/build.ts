import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/llvm/llvm-project/releases/download/llvmorg-${version}/openmp-${version}.src.tar.xz`);

  // grab the extra `*.cmake` files this project needs to build
  // the cd stuff is required to make it build, we need a directory parent to the sources with the cmake shit
  Path.parent().join("cmake").mkdir().cd();
  await unarchive(`https://github.com/llvm/llvm-project/releases/download/llvmorg-${version}/cmake-${version}.src.tar.xz`);
  Path.parent().cd();

  run`cmake
        -S src
        -B bld
        -DLIBOMP_INSTALL_ALIASES=OFF
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -Wno-dev'
        -DBUILD_TESTING=OFF
        `;
  run`cmake --build bld --target install`;
}
