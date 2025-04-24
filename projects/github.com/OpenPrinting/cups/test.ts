import { backticks, TestOptions } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";

export default async function ({ version }: TestOptions) {
  assertStringIncludes(await backticks`cups-config --version`, `${version}`);
//
}