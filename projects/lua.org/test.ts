import { backticks, run } from "brewkit";

export default async function () {
  run`lua -v`;
  run`lua -e 'print("Hello World!")'`;
  const ccflags = await backticks`pkgx pkg-config --cflags --libs lua`;
  run`cc test.c ${ccflags}`;
  run`./a.out`;
}
