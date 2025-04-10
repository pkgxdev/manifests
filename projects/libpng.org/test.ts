import { run } from "brewkit";

export default async function() {
  run`cc test.c -lpng`;
  run`./a.out`;
}
