import { run, TestOptions } from "brewkit";

export default async function () {
  run`cc test.c -lfreetype`;
  run`./a.out`;
}
