import { backticks, run, undent } from "brewkit";
import { assertEquals } from "jsr:@std/assert@^1/equals";

export default async function () {
  run`clang test.c`;
  const out = await backticks`./a.out`;
  assertEquals(out, "Hello World!");
}
