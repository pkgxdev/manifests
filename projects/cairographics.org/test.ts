import { run } from "brewkit";

export default async function () {
  run`cc ./test.c -lcairo`;
  run`./a.out`;
}