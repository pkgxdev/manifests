import { run } from "brewkit";

export default function () {
  run`cc test.c -lyaml`;
  run`./a.out`;
}
