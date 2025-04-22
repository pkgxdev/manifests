import { backticks, run, TestOptions } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";
import env_include from "../../../brewkit/env-include.ts";

export default async function ({ version }: TestOptions) {
  const out = await backticks`pkgx pkg-config --modversion xcursor`;
  assertStringIncludes(out, `${version}`)

  env_include("x.org/protocol");
  run`cc test.c`;
  run`./a.out`;
}
