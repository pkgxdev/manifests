import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/strukturag/libheif/releases/download/v${version}/libheif-${version}.tar.gz`);
  run`cmake
        -B bld
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DCMAKE_VERBOSE_MAKEFILE=ON
        -Wno-dev
        -DBUILD_TESTING=OFF
        `;
  run`cmake --build bld --target install`;

//   - 'mkdir -p ${prefix}/pkgshare'
//   - 'mv ./examples/example.heic ${prefix}/pkgshare/'
//   - 'mv ./examples/example.avif ${prefix}/pkgshare/'
//   - 'mkdir -p ${prefix}/share/mime/packages'
//   - 'update-mime-database ${prefix}/share/mime'
}
