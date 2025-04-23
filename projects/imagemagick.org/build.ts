import { BuildOptions, unarchive, run, inreplace } from "brewkit";

export default async function ({ prefix, tag, version }: BuildOptions) {
  await unarchive(`https://github.com/ImageMagick/ImageMagick/archive/${tag}.tar.gz`);

  // we use the DESTDIR trick or the install fails due to trying to write to /etc
  // (despite the fact `--enable-zero-configuration` embeds them in the binaries)
  Deno.env.set("DESTDIR", prefix.string);

  run`./configure
        --prefix=/usr/local
        --sysconfdir=/etc
        --enable-osx-universal-binary=no
        --enable-zero-configuration  # portability: embeds config files in the binary
        --disable-installed          # makes us relocatable
        --disable-silent-rules
        --disable-opencl
        --enable-shared
        --with-png=yes
        --with-tiff=yes
        --with-jxl=yes
        --with-perl=yes
        --with-freetype=yes
        --with-gvc=no
        --with-modules
        --with-openjp2
        --with-openexr
        --with-webp=yes
        --with-heic=yes
        --with-lqr
        --without-djvu
        --without-fftw
        --without-pango
        --without-wmf
        --without-perl
        --without-x
        --enable-openmp
        --with-zip=yes`;

  run`make --jobs ${navigator.hardwareConcurrency} install`;

  for await (const [path] of prefix.join("usr/local").ls()) {
    path.mv({ into: prefix });
  }
  prefix.join("usr/local").rm().parent().rm();

  for (const x of ["Magick++", "MagickCore", "MagickWand"]) {
    const fn = prefix.bin.join(`${x}-config`);
    inreplace(
      fn,
      `prefix=/imagemagick.org/v${version}`,
      `prefix="$(cd "$(dirname "$0")/.." && pwd)"`);

    inreplace(fn,
      prefix.parent().parent().parent().join("bin/pkg-config").string,
      "pkgx pkg-config");
  }
}
