import { backticks_quiet, fixture, run, TestOptions } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";

export default async function ({ version }: TestOptions) {
  assertStringIncludes(backticks_quiet`magick -version`, `${version}`);

  run`magick identify ${fixture('png')}`;

  if (Deno.build.os == 'darwin') {
    run`pkgx +ruby@3 gem install rmagick`;
  }
}
