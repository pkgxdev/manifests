import { BuildOptions, run } from "brewkit";
import unarchive from "../../../brewkit/unarchive.ts";

export default async function ({ prefix, tag, version }: BuildOptions) {
  await unarchive(
    `https://github.com/libexpat/libexpat/releases/download/${tag}/expat-${version}.tar.xz`,
  );
  run`./configure --prefix=${prefix} --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
