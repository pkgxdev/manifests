import { run } from "brewkit";

export default async function () {
  run`cc -lxslt -lxml2 test.c`;
  run`./a.out`;
}
