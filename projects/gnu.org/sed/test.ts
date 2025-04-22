import { run } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";
import { assert } from "node:console";

export default async function () {
  Deno.writeTextFileSync("test.txt", "Hello world!");
  run`sed -i 's/world/World/g' ./test.txt`;
  assertEquals(Deno.readTextFileSync("test.txt").trim(), "Hello World!");
}