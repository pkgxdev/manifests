import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";
import { backticks, TestOptions } from "brewkit";

export default async function ({version}: TestOptions) {
  const out = await backticks`pkg-config --modversion xrandr`;
  assertStringIncludes(out, `${version}`);
}
