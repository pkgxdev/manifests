import { run } from "brewkit";

export default async function () {
  run`cc test.c -lsodium`;
  run`./a.out`;
}
