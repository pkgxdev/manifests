import { backticks, TestOptions } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";

export default async function ({ version, prefix }: TestOptions) {
  assertStringIncludes(await backticks`apu-1-config --version`, `${version}`);
  assertStringIncludes(await backticks`apu-1-config --prefix`, `${prefix}`);
}