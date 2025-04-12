import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version, tag }: BuildOptions) {
  const url = `https://github.com/libevent/libevent/releases/download/${tag}/libevent-${version}-stable.tar.gz`;
  await unarchive(url);
  run`cmake
      -B ./build
      -GNinja
      -DCMAKE_BUILD_TYPE=Release
      -DCMAKE_INSTALL_PREFIX=${prefix}
      -DCMAKE_POLICY_VERSION_MINIMUM=3.5  # https://github.com/libevent/libevent/issues/1782
      `;
  run`cmake --build ./build --config Release --target install`;
}
