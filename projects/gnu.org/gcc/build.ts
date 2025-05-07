import { env_include, BuildOptions, Path, run, unarchive } from "brewkit";
import { expandGlob } from "jsr:@std/fs@1/expand-glob";

export default async function build({ prefix, version }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/gcc/gcc-${version}/gcc-${version}.tar.gz`);

  let extra = "";

  if (Deno.build.os == "linux") {
    env_include("gnu.org/gcc^14");
    extra = `
      --disable-multilib
      --build=x86_64-pc-linux-gnu  # or compile fails due to dupe pid_t
      --with-arch=x86-64   # or c++ crashes with illegal instructions inside docker
      --with-tune=generic  # ^^ same
      #--enable-default-pie
      #--enable-pie-tools
      #--enable-host-pie
      `;
  }

  Path.cwd().join("build").mkdir().cd();

  run`../configure
        --prefix=${prefix}
        --enable-languages=c,c++
        --disable-multilib
        --enable-bootstrap
        --with-bugurl=https://github.com/pkgxdev/manifests/issues
        "--with-boot-ldflags=-static-libgcc -static-libstdc++"
        --disable-nls
        --enable-shared
      # --with-system-zlib  #TODO
        "--with-pkgversion=pkgx GCC ${version}"
        ${extra}
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install-strip`; // cannot install in parallel

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
