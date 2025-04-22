import { backticks, run } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";

export default async function () {
  run`unbound-control-setup -d .`;
  if (Deno.build.os == 'linux') {
    const out = await backticks`unbound-host pkgx.dev`;
    assertStringIncludes(out, "pkgx.dev has address");
    assertStringIncludes(out, "pkgx.dev mail is handled by");
  }
}
