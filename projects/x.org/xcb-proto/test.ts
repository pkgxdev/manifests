import { run } from "brewkit";

export default async function () {
  run`pkg-config --variable=xcbincludedir xcb-proto`;
  run`pkgx python~3.9 test.py`;
}
