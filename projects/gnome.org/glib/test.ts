import { run } from "brewkit";

export default async function () {
  run`cc -lglib-2.0 -lintl test.c`;
  run`./a.out`;
  run`glib-mkenums --help`;
}
