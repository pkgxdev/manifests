import { backticks } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  Deno.writeTextFileSync("test.js", "console.log('Hello, world!')");
  const out = await backticks`node ./test.js`;
  assertEquals(out, "Hello, world!");
}
