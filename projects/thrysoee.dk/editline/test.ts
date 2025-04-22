import { run } from "brewkit";

export default async function () {
  run`cc test.c -ledit`;
  run`./a.out`;
}
