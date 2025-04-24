import { backticks, run, TestOptions } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function ({ version }: TestOptions) {
  run`cc -lnghttp2 test.c`;
  assertEquals(await backticks`./a.out`, `${version}`);
}