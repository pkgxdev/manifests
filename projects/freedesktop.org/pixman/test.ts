import { run } from "brewkit";

export default async function () {
  run`cc test.c -lpixman-1`;
  run`./a.out`;//
}
