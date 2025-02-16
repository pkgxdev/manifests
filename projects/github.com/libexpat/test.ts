import { backticks, run } from "brewkit";
import { assertEquals } from "jsr:@std/assert@^1/equals";

export default async function test() {
  run`cc test.c -lexpat`;
  const out = await backticks`./a.out`;
  assertEquals(out, "tag:str|data:Hello, world!|");
}
