import { run } from "brewkit";

export default async function () {
  run`pkg-config --variable=xcbincludedir xcb-proto`;
  run`python3 test.py`;
}
