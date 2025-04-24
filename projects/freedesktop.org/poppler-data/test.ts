import { run } from "brewkit";

export default async function () {
  run`pkgx pkg-config --cflags poppler-data`;
}