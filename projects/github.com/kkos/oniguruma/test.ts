import { backticks, TestOptions } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function ({ version }: TestOptions) {
  assertEquals(await backticks`onig-config --version`, version.toString());
//
}