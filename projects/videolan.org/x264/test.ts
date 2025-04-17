import { backticks, run, TestOptions } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";

export default async function ({ version }: TestOptions) {
  run`cc test.c -lx264`;
  run`./a.out`;

  assertStringIncludes(await backticks`x264 --version`, version.toString())
}
