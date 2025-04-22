import { BuildOptions, unarchive, run } from "brewkit";
import env_include from "../../../../brewkit/env-include.ts";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/westes/flex/releases/download/${tag}/flex-${version}.tar.gz`);

  if (Deno.build.os === "linux") {
    Deno.env.set("CPPFLAGS", "-D_GNU_SOURCE");
    env_include("gnu.org/m4");
  } else if (Deno.build.os === "darwin") {
    Deno.env.set("MACOSX_DEPLOYMENT_TARGET", "10.6");
  }

  run`./configure --prefix=${prefix} --with-pic --disable-bootstrap --enable-shared`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
