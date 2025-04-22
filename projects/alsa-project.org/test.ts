import { run } from "brewkit";

export default async function () {
  run`cc test.c -lasound`;
  run`./a.out`;
}
