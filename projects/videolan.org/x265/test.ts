import { backticks, SemVer, TestOptions } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function ({ version }: TestOptions) {
  const out = await backticks`pkgx pkg-config --modversion x265`;
  assertEquals(new SemVer(out).toString(), version.toString());
}
