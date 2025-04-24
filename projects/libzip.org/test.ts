import { backticks, run } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  run`ziptool -n foobar.zip add foo.txt bar`;
  const out = await backticks`ziptool foobar.zip cat 0`;
  assertEquals(out, "bar");
}