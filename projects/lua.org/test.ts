import { backticks, run } from "brewkit";

//TODO test luac

export default async function () {
  run`lua -v`;

  run`lua -e 'print("Hello World!")'`;

  const ccflags = await backticks`pkgx pkg-config --cflags --libs lua`;
  run`cc test.c ${ccflags}`;
  run`./a.out`;

  run`luac -o test.luac test.lua`;
}
