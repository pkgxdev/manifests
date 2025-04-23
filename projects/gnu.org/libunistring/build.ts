import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/libunistring/libunistring-${tag}.tar.gz`);
  run`./configure
        --prefix=${prefix}
        --disable-debug
        --disable-dependency-tracking
        --disable-silent-rules
        `;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}