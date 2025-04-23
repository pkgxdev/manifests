import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";
import { backticks, TestOptions } from "brewkit";

export default async function ({ prefix }: TestOptions) {
  assertStringIncludes(
    await backticks`which -a which`,
    prefix.join("bin/which").string);
}
