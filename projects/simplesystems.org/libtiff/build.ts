import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://download.osgeo.org/libtiff/tiff-${version}.tar.gz`);
  run`./configure
        --prefix=${prefix}
        --enable-zstd
        --disable-dependency-tracking
        --disable-lzma
        --disable-webp
        --with-jpeg-include-dir=${deps['libjpeg-turbo.org'].prefix}/include
        --with-jpeg-lib-dir=${deps['libjpeg-turbo.org'].prefix}/lib
        --without-x
        `;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
