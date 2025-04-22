import { BuildOptions, unarchive, run, env_include } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/google/glog/archive/refs/tags/${tag}.tar.gz`);

  env_include("github.com/gflags^2");

  run`cmake
        -B bld
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DBUILD_SHARED_LIBS=ON
        -DCMAKE_CXX_FLAGS=-std=c++14`;
  run`cmake --build bld --target install`;
}
