import { backticks, TestOptions } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function({ version }: TestOptions) {
  const out = await backticks`pkgo --version`;
  assertEquals(out, `pkgo ${version}`);
}
