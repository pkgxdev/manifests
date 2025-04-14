import { BuildOptions, unarchive, run, inreplace, Path } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/ImageMagick/ImageMagick/archive/${tag}.tar.gz`);

  run`./configure
        --prefix=${prefix}
        --enable-osx-universal-binary=no
        --disable-silent-rules
        --disable-opencl
        --disable-installed
        --enable-shared
        --with-png=yes
        --with-tiff=yes
      # --with-jxl=yes
      # --with-perl=yes
        --with-freetype=yes
        --with-gvc=no
        --with-modules
      # --with-openjp2
      # --with-openexr
      # --with-webp=yes
        --with-heic=yes
        --with-lqr
      # --without-lzma
        --without-djvu
        --without-fftw
        --without-pango
        --without-wmf
        --without-perl
        --without-x
      # --enable-openmp
      # --with-zip=yes`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;

  for (const x of ["Magick++", "MagickCore", "MagickWand"]) {
    const fn = prefix.bin.join(x);
    inreplace(
      fn,
      `prefix=${prefix}`,
      `prefix="$(cd "$(dirname "$0")/.." && pwd)"`);

    inreplace(fn,
      Path.cwd().parent().join("bin/pkg-config").string,
      "pkgx pkg-config");
  }
}
