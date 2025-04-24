import { backticks, run } from "brewkit";

export default async function () {
  run`cc test.c -lgdk_pixbuf-2.0`;
  run`./a.out`;
}
