import { BuildOptions, unarchive, run, env_include } from "brewkit";

export default async function ({ prefix, tag, deps }: BuildOptions) {
  await unarchive(`https://github.com/ImageMagick/ImageMagick/archive/${tag}.tar.gz`);

  Deno.env.set("LDFLAGS", `-L${deps['gnu.org/libtool'].prefix}/lib`);

  console.error("LDFLAGS", Deno.env.get("LDFLAGS"));
  console.error("LDFLAGS", Deno.env.get("CPATH"));

  run`./configure
        --prefix=${prefix}
      # --libdir=${prefix}/lib
        --enable-osx-universal-binary=no
        --disable-silent-rules
        --disable-opencl
      # --enable-static
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
  // script:
//   - >-
//     sed -i -e 's|${PACKAGE_NAME}-${PACKAGE_BASE_VERSION}|${PACKAGE_NAME}|g'
//     configure
//   - >-
//     find . -type f -name '*-config.in' -exec sed -i'' -e
//     's|@PKG_CONFIG@|pkg-config|g' {} +
//   - ./configure $ARGS
//   - 'make --jobs ${navigator.hardwareConcurrency} install'
//   - run: >-
//       sed -i'' -e 's|^prefix=.*|prefix=${MAGICK_HOME}|g' Magick++-config
//       MagickCore-config MagickWand-config
//     working-directory: '${{prefix}}/bin'
//   - run: |
//       mv ImageMagick-{{version.major}}/* .
//       rmdir ImageMagick-{{version.major}}
//       ln -s . ImageMagick-{{version.major}}
//     working-directory: '${{prefix}}/include'
// env:
//   LDFLAGS:
//     - '-L{{deps.gnu.org/libtool.prefix}}/lib'
//     - '-L{{deps.liblqr.wikidot.com.prefix}}/lib'
//     - '-L{{deps.sourceware.org/bzip2.prefix}}/lib'
//     - '-L{{deps.ijg.org.prefix}}/lib'
//   ARGS:
//     - '--prefix=${prefix}'
//     - '--libdir={{prefix}}/lib'
//     - '--enable-osx-universal-binary=no'
//     - '--disable-silent-rules'
//     - '--disable-opencl'
//     - '--enable-static'
//     - '--disable-installed'
//     - '--enable-shared'
//     - '--with-png=yes'
//     - '--with-tiff=yes'
//     - '--with-jxl=yes'
//     - '--with-perl=yes'
//     - '--with-freetype=yes'
//     - '--with-gvc=no'
//     - '--with-modules'
//     - '--with-openjp2'
//     - '--with-openexr'
//     - '--with-webp=yes'
//     - '--with-heic=yes'
//     - '--with-lqr'
//     - '--without-lzma'
//     - '--without-djvu'
//     - '--without-fftw'
//     - '--without-pango'
//     - '--without-wmf'
//     - '--without-perl'
//     - '--enable-openmp'
//     - '--with-zip=yes'
//   linux:
//     ARGS:
//       - '--with-x=yes'
//       - '--x-includes={{deps.x.org/x11.prefix}}/include'
//       - '--x-libraries={{deps.x.org/x11.prefix}}/lib'
//   darwin:
//     ARGS:
//       - '--without-x'
}