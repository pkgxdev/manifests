import { backticks } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  Deno.writeTextFileSync("./test.txt", "a _lsimple _RteST_o th_oat");
  const out = await backticks`fribidi --charset=CapRTL --clean --nobreak ./test.txt`;
  assertEquals(out, "a simple TSet that");
}
