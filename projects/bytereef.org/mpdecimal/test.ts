import { run } from "brewkit";

export default async function () {
  run`cc test.c -lmpdec`;
  run`./a.out`;
}