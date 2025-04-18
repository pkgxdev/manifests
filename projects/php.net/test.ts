import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";
import { backticks, run, TestOptions } from "brewkit";

export default async function ({ version }: TestOptions) {
  assertStringIncludes(await backticks`php --version`, version.toString());
  run`php -r 'echo "Hello World!\n";'`;
}
