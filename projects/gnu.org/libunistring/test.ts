import { backticks, run } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  run`cc -lunistring test.c`;
  assertEquals(
    await backticks`./a.out`,
    "🫖\\n");
}
