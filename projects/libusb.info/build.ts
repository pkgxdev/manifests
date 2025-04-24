import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/libusb/libusb/releases/download/v${version}/libusb-${version}.tar.bz2`);
  run`./configure --prefix=${prefix} --disable-debug`;
  run`make --jobs=${navigator.hardwareConcurrency} install`;
}