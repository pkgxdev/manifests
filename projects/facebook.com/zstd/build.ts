import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/facebook/zstd/archive/v${version}.tar.gz`);

  Path.cwd().join("build/out").mkdir().cd();

  run`cmake ../cmake
      -GNinja
      -DCMAKE_BUILD_TYPE=Release
      -DCMAKE_INSTALL_PREFIX=${prefix}
      -DZSTD_PROGRAMS_LINK_SHARED=ON
      -DZSTD_BUILD_CONTRIB=ON
      -DZSTD_LEGACY_SUPPORT=ON
      -DZSTD_ZLIB_SUPPORT=ON
      -DZSTD_LZMA_SUPPORT=ON
      -DZSTD_LZ4_SUPPORT=ON
      `;
  run`cmake --build .`
  run`cmake --install .`
}
