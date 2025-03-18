import { run } from "brewkit";

export default async function () {
  run`cc test.c -lgmp -lmpc -lmpfr`;
  run`./a.out`;
}
