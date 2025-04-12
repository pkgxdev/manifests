import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-${version}.tar.gz`);
  run`./configure --prefix=${prefix} --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;
}
