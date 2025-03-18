import { backticks, run, TestOptions } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function ({ version }: TestOptions) {
  run`cc test.c -lgmp -lmpfr`;
  assertEquals(await backticks`./a.out`, version.toString());
}
