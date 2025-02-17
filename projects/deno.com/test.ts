import { assertMatch } from "jsr:@std/assert@^1/match";
import { backticks, TestOptions } from "brewkit";

export default async function ({ version }: TestOptions) {
  assertMatch(await backticks`deno --version`, new RegExp(`^deno ${version}`));
}
