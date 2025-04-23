import { run } from "brewkit";

export default async function () {
  run`p11-kit list-modules`;

  run`cc ./test.c -lp11-kit`;
  run`./a.out`;
}
