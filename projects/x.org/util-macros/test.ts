import { run } from "brewkit";

export default async function () {
  run`pkgx pkg-config --exists xorg-macros`;
}
