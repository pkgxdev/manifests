import { BuildOptions, inreplace, run, unarchive } from "brewkit";
import { autofoo_fixes } from "../autoconf/build.ts";

export default async function ({ prefix, tag, version }: BuildOptions) {
  await unarchive(`https://ftpmirror.gnu.org/gnu/automake/automake-${tag}.tar.gz`);
  run`./configure
    --prefix=${prefix}
    --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;

  const { bin } = prefix;

  for await (const [path, { name }] of bin.ls()) {
    if (!name.endsWith(`-${version.marketing}`)) {
      await autofoo_fixes(path, prefix);
    }
  }

  const config_pm = prefix.share.join(`automake-${version.marketing}`, "Automake/Config.pm");
  autofoo_fixes(config_pm, prefix, false);
  inreplace(config_pm, "my $prefix;", "my $prefix = dirname(dirname(dirname(dirname(abs_path(__FILE__)))));");

  // rehardlink
  bin.join(`automake-${version.marketing}`).rm().ln(bin.join("automake"));
  bin.join(`aclocal-${version.marketing}`).rm().ln(bin.join("aclocal"));
}
