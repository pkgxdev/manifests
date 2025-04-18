import { run } from "brewkit";

export default async function () {
  run`cc test.c -lxcb`;
  run`./a.out`;
}
