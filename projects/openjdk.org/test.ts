import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";
import { assertEquals } from "jsr:@std/assert@1/equals";
import { backticks, run, TestOptions } from "brewkit";

export default async function ({ version }: TestOptions) {
  assertStringIncludes(await backticks`java --version`, `${version.major}.${version.minor}`);
  run`javac HelloWorld.java`;
  assertEquals(await backticks`java HelloWorld`, 'Hello, world!');
}