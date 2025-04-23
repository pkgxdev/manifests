import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version, tag }: BuildOptions) {
  await unarchive(`https://github.com/libjxl/libjxl/archive/refs/tags/${tag}.tar.gz`);

  // the `SJPEG` library is unversioned so we have not yet pkg’d it
  run`./deps.sh`;

  // we provide everything else, so delete them so it doesn’t build against them
  //FIXME is wasteful to download them, but hacking the script is fragile
  for await ( const [path, {name}] of Path.cwd().join("third_party").ls()) {
    if (name.startsWith("sjpeg")) continue;
    if (name == "CMakeLists.txt") continue;
    if (name.endsWith(".cmake")) continue;
    path.rm('rf');
  }

  if (Deno.build.os == "linux") {
    // ld.lld: error: undefined reference: __extendhfsf2
    Deno.env.set("LDFLAGS", "-Wl,--allow-shlib-undefined");
  }

  run`cmake
        -B bld
        -DCMAKE_BUILD_TYPE=Release
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DBUILD_TESTING=OFF
        -DJPEGXL_ENABLE_SKCMS=OFF
        -DJPEGXL_ENABLE_BENCHMARK=OFF
        -DJPEGXL_VERSION=${version}
        `;
  run`cmake --build bld --target install`;

//   linux/x86-64:
//     ARGS:
//       - '-DCMAKE_EXE_LINKER_FLAGS=-Wl,--allow-shlib-undefined,-lstdc++fs'
//   linux/aarch64:
//     ARGS:
//       - '-DCMAKE_EXE_LINKER_FLAGS=-Wl,-lstdc++fs'
}