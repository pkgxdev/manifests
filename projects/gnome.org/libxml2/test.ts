import { run } from "brewkit";

export default async function() {
  run`cc -lxml2 test.c`;
  run`./a.out`;

  run`pkgx python^3.9 -c "import libxml2"`;
}
