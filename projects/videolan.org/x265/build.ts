import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`http://ftp.videolan.org/pub/videolan/x265/x265_${tag}.tar.gz`);

  const srcroot = Path.cwd();

  const args = `
    -Wno-dev
    -DBUILD_TESTING=OFF
    -DCMAKE_FIND_FRAMEWORK=LAST
    -DCMAKE_INSTALL_LIBDIR=lib
    -DENABLE_PIC=ON
    -DCMAKE_INSTALL_PREFIX=${prefix}
    -DCMAKE_VERBOSE_MAKEFILE=ON`;

  const high_bitrate_args = `
    -DHIGH_BIT_DEPTH=ON
    -DEXPORT_C_API=OFF
    -DENABLE_SHARED=OFF
    -DENABLE_CLI=OFF`;

  srcroot.join("10bit").mkdir().cd();
  run`cmake
        ../source
        -DENABLE_HDR10_PLUS=ON
        ${args}
        ${high_bitrate_args}`;
  run`cmake --build .`;
  Path.cwd().join("libx265.a").mv({ to: srcroot.join("8bit").mkdir().join("libx265_main10.a") });

  srcroot.join("12bit").mkdir().cd();
  run`cmake
        ../source
        -DMAIN12=ON
        ${args}
        ${high_bitrate_args}`;
  run`cmake --build .`;
  Path.cwd().join("libx265.a").mv({ to: srcroot.join("8bit/libx265_main12.a") });

  srcroot.join("8bit").mkdir().cd();
  run`cmake
        ../source
        ${args}
        -DLINKED_10BIT=ON
        -DLINKED_12BIT=ON
        -DEXTRA_LINK_FLAGS=-L.
        -DEXTRA_LIB=x265_main10.a;x265_main12.a
        `;
  run`cmake --build .`;
  Path.cwd().join("libx265.a").mv({ to: Path.cwd().join("libx265_main.a") });

  if (Deno.build.os === "darwin") {
    run`libtool -static -o libx265.a libx265_main.a libx265_main10.a libx265_main12.a`;
  } else {
    run`ar crs libx265.a libx265_main.a libx265_main10.a libx265_main12.a`;
  }

  run`cmake --build . --target install`;
}
