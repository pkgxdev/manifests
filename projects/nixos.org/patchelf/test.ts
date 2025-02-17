import { run } from "brewkit";

export default async function () {
  run`patchelf --version`; // FIXME better
}
