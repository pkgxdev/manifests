import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://libssh2.org/download/libssh2-${version}.tar.gz`);

  run`./configure --prefix=${prefix} --with-openssl --with-libz --disable-examples-build`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
