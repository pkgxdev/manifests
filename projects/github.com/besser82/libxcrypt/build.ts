import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/besser82/libxcrypt/releases/download/v${version}/libxcrypt-${version}.tar.xz`);
  run`./configure
        --prefix=${prefix}
        --disable-valgrind
        --disable-symvers
        --disable-failure-tokens`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
