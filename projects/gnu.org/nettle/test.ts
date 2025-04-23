import { run } from "brewkit";

export default async function () {
  run`cc -lnettle test.c`;
  run`./a.out`;
}