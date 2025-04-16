import { run } from "brewkit";

export default async function () {
  let libs = '-lglib-2.0';
  if (Deno.build.os == 'darwin') {
    libs += ' -lintl';
  }

  run`cc ${libs} test.c`;
  run`./a.out`;
  run`glib-mkenums --help`;
}
