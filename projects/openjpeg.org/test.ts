import { run } from "brewkit";

export default async function () {
  run`cc test.c -lopenjp2`;
  run`./a.out`;
}
