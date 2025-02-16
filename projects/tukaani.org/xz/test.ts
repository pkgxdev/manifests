import { backticks, TestOptions, undent } from "brewkit";
import { assertEquals } from "jsr:@std/assert@^1";

export default async function ({ version }: TestOptions) {
  const lines = (await backticks`xz --version`).split(/\r?\n/);
  assertEquals(
    lines,
    [`xz (XZ Utils) ${version}`, `liblzma ${version}`],
  );
}
