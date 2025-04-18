import { run } from "brewkit";

export default async function () {
  run`cc test.c`;
  run`./a.out`;
}
