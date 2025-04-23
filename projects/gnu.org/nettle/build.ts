import { env_include, ensure, BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/nettle/nettle-${version}.tar.gz`);
  run`./configure
        --prefix=${prefix}
        --disable-debug
        --disable-dependency-tracking
        --disable-silent-rules
        `;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}