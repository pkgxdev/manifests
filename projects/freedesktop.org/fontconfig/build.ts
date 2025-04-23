import { env_include, BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.freedesktop.org/software/fontconfig/release/fontconfig-${version}.tar.xz`);

  if (Deno.build.os == 'linux') {
    env_include('gnu.org/gperf');
  }

  Deno.env.set("DESTDIR", prefix.string);

  run`./configure
        --prefix=/usr/local
        --disable-debug
        --localstatedir=/var
        --sysconfdir=/etc
        --enable-libxml2
        `;
  run`make --jobs ${navigator.hardwareConcurrency} install RUN_FC_CACHE_TEST=false`;

  for await (const [path] of prefix.join("usr/local").ls()) {
    path.mv({ into: prefix });
  }
  prefix.join("usr/local").rm().parent().rm();

  prefix.join("share/doc").rm('rf');
}
