import { BuildOptions, env_include, Path, run, stub, unarchive, tmp } from "brewkit";

export default async function ({ prefix, tag, version }: BuildOptions) {
  await unarchive(`http://ftp.gnu.org/gnu/libc/glibc-${tag}.tar.gz`);

  stub("gawk bison");
  env_include("gnu.org/gcc");

  const kernel_headers = Path.cwd().join(`kernel-5.4`);
  await tmp(async cwd => {
    await unarchive(`https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.4.tar.xz`);
    run`make headers`;
    cwd.join("usr/include").cp({ to: kernel_headers.mkdir()})
  });

  Path.cwd().join("build").mkdir().cd();

  run`../configure
        --prefix=${prefix}
        --disable-debug
        --enable-kernel=5.4  # LTS 2029
        --disable-dependency-tracking
        --disable-silent-rules
        --disable-werror
        --without-gd
        --without-selinux
        --with-pkgversion="pkgx glibc-${version}"
        --with-bugurl=https://github.com/pkgxdev/pantry/issues/new
        --with-headers=${kernel_headers}
        CFLAGS="-O2 -march=x86-64 -mtune=generic"
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  // run`make check`;
  run`make install`;
}
