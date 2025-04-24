import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/nghttp2/nghttp2/releases/download/v${version}/nghttp2-${version}.tar.gz`);
  run`./configure --prefix=${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency} -C lib install`;
}
