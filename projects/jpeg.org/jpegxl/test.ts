import { fixture, run } from "brewkit";

export default async function () {
  run`cjxl ${fixture('jpeg')} out.jxl`;
  run`cc test1.c -ljxl`;
  run`./a.out`;
  run`cc test2.c -ljxl_threads`;
  run`./a.out`;
}
