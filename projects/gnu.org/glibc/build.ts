import { BuildOptions, env_include, Path, run, stub, unarchive } from "brewkit";

export default async function ({ prefix, tag, version }: BuildOptions) {
  await unarchive(`http://ftp.gnu.org/gnu/libc/glibc-${tag}.tar.gz`);

  stub("gawk bison");
  env_include("gnu.org/gcc");

  Path.cwd().join("build").mkdir().cd();

  run`../configure
        --prefix=${prefix}
        --disable-debug
        --enable-kernel=2.6.0
        --disable-dependency-tracking
        --disable-silent-rules
        --disable-werror
        --enable-obsolete-rpc
        --without-gd
        --without-selinux
        --disable-multi-arch
       "--with-pkgversion=pkgx glibc-${version}"
        --with-bugurl=https://github.com/pkgxdev/pantry/issues/new
       "CFLAGS=-static-libgcc -O3"
        LDFLAGS=-static-libgcc
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  // run`make check`;
  run`make install`;
}
