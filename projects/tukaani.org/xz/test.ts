import { backticks, TestOptions, undent } from "brewkit";
import { assertEquals } from "jsr:@std/assert@^1";

export default async function ({ version }: TestOptions) {
  assertEquals(
    await backticks`xz --version`,
    undent`
      xz (XZ Utils) ${version}
      liblzma ${version}
      `.trim(),
  );
}
