import { env_include, BuildOptions, Path, run, unarchive } from "brewkit";
import { expandGlob } from "jsr:@std/fs@1/expand-glob";

export default async function build({ prefix, version }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/gcc/gcc-${version}/gcc-${version}.tar.gz`);

  env_include("gnu.org/gcc^14");

  Path.cwd().join("build").mkdir().cd();

  run`../configure
        --prefix=${prefix}
        --enable-languages=c,c++
        --disable-multilib
        --disable-bootstrap
        --disable-nls
        --enable-shared
        --enable-lto
  #TODO --with-system-zlib
        --with-bugurl=https://github.com/pkgxdev/manifests/issues
        "--with-pkgversion=pkgx GCC ${version}"
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install-strip`;

  const lib64 = prefix.join("lib64");
  for await (const { path } of expandGlob(`${lib64}/*`)) {
    new Path(path).mv({ into: prefix.lib });
  }
  lib64.rm();

  // weirdly the omissions below are already hardlinked
  prefix.bin.join("cc").ln("s", { target: "gcc" });
  prefix.bin.join("ar").ln("s", { target: "gcc-ar" });
  prefix.bin.join("nm").ln("s", { target: "gcc-nm" });
  prefix.bin.join("ranlib").ln("s", { target: "gcc-ranlib" });
}
