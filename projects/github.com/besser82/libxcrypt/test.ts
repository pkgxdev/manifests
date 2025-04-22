import { run } from "brewkit";

export default async function () {
  run`cc -lcrypt test.c`;
  run`./a.out`;
}
