import { backticks, run } from "brewkit";

export default async function () {
  const libs = await backticks`pkg-config --libs libffi`;
  run`cc -o closure test.c ${libs} -Wno-incompatible-pointer-types`;
  run`./closure`;
}
