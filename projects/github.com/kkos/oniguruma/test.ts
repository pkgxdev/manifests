import { backticks, TestOptions } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function ({ version, prefix }: TestOptions) {
  assertEquals(await backticks`onig-config --version`, version.toString());
  assertEquals(await backticks`onig-config --prefix`, prefix.string);
}
