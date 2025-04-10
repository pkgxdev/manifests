import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/libgit2/libgit2/archive/v${version}.tar.gz`);
  run`cmake .
    -DBUILD_EXAMPLES=OFF
    -DBUILD_TESTS=OFF
    -DUSE_SSH=ON
    -DBUILD_SHARED_LIBS=ON
    -DCMAKE_INSTALL_PREFIX=${prefix}
    -DCMAKE_BUILD_TYPE=Release`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
