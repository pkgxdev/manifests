import { run } from "brewkit";

export default async function () {
  run`cc test.c -lopus`;
  run`./a.out`;
}