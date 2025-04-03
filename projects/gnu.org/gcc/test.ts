import { assertMatch } from "jsr:@std/assert@1/match";
import { backticks, Path, run, TestOptions } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function ({ version }: TestOptions) {
  assertMatch(await backticks`gcc --version`, new RegExp(`pkgx GCC ${version}`));
  run`gcc -print-libgcc-file-name`;
  run`gcc -print-multiarch`;
  run`gcc -dumpspecs`;

  // gha mac runners have broken SDKs...
  if (
    Deno.build.os == "darwin" &&
    !new Path("/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include/AvailabilityInternalLegacy.h").isFile()
  ) {
    return;
  }

  run`gcc test.c -lgmp`;
  run`./a.out`;

  run`g++ test.cc`;
  assertEquals(await backticks`./a.out`, "Hello, world!");
}
