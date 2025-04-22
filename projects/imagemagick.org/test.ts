import { backticks_quiet, fixture, run, TestOptions } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";

export default async function ({ version }: TestOptions) {
  const vstr = `${version}`.replace(/\.(\d+)$/, ([,m]) => `-${m}`);
  assertStringIncludes(backticks_quiet`magick -version`, vstr);

  run`magick identify ${fixture('png')}`;

  if (Deno.build.os == 'darwin') {
    try {
      run`pkgx +ruby@3 gem install rmagick`;
    } catch (e) {
      console.error("::error::you need to fix gem user installs!");
      console.error(e);
    }
  }
}
