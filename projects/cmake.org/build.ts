import { BuildOptions, ensure, run, unarchive } from "brewkit";

//NOTE we statically link everything because we have a policy
// where build tools have no deps to prevent their deps inadvertently
// leaking into other builds

export default async function ({ prefix, deps, version }: BuildOptions) {
  await unarchive(`https://github.com/Kitware/CMake/releases/download/v${version}/cmake-${version}.tar.gz`);

  let cmake: any;
  try {
    ensure("cmake");

    run`cmake
          -S .
          -B build
          -DCMake_BUILD_LTO=ON
          -DCMAKE_INSTALL_PREFIX=${prefix}
          -DCMAKE_BUILD_TYPE=Release
          -DCMAKE_USE_OPENSSL=OFF   # FIXME vendor static libs or something
          `;

    run`cmake
          --build build
          --config Release
          --target install
          --parallel`;
  } catch {
    run`./bootstrap
        --prefix=${prefix}
        --docdir=/share/doc
        --mandir=/share/man
        --
        -DCMake_BUILD_LTO=ON
        -DCMAKE_BUILD_TYPE=Release
        -DCMAKE_USE_OPENSSL=OFF
        `;

    run`make install --jobs=${navigator.hardwareConcurrency}`;
  }

  // we have a “docs are on the Internet” policy
  prefix.share.join(`cmake-${version.marketing}/Help`).rm("rf");
}
