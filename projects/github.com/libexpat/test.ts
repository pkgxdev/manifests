import { backticks, run } from "brewkit";
import { assertEquals } from "jsr:@std/assert@^1/equals";

export default async function test() {
  if (Deno.build.os != "windows") {
    run`cc test.c -lexpat -o test`;
  } else {
    run`cl test.c libexpat.lib`;
  }
  const out = await backticks`./test`;
  assertEquals(out, "tag:str|data:Hello, world!|");
}
