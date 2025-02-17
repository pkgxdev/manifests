import { assertEquals } from "jsr:@std/assert@^1/equals";
import { run } from "brewkit";

export default async function () {
  Deno.writeTextFileSync("Makefile", "foo:\n\techo bar > $@");
  run`make`;
  assertEquals(Deno.readTextFileSync("foo"), "bar\n");
  run`make --question`;
}
