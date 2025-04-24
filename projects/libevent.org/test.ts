import { run } from "brewkit";

export default async function () {
  run`cc ./test.c -levent`;
  run`./a.out`;
}
