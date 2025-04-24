import { backticks, TestOptions } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";

export default async function ({ version }: TestOptions) {
  const out = await backticks`re2c --version`;
  assertStringIncludes(out, `${version.major}.${version.minor}`);
}
