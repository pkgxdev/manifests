import { backticks, TestOptions } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";

export default async function ({ version }: TestOptions) {
  const out = await backticks`ldapcompare -VV`;
  //TODO comes in via stderr assertStringIncludes(out, `${version}`);
}