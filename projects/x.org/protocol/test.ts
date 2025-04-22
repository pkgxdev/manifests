import { run } from "brewkit";

export default async function () {
  run`pkgx pkg-config --cflags xproto`;
  run`pkg-config --cflags xf86driproto`;
}
