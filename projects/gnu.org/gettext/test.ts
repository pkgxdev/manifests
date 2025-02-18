import { assertEquals } from "jsr:@std/assert@^1/equals";
import { backticks } from "brewkit";

export default async function () {
  assertEquals(await backticks`gettext test`, "test");
}
