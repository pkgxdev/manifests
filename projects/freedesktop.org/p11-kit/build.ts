import { env_include, BuildOptions, unarchive, run, inreplace } from "brewkit";

export default async function ({ prefix, version, deps }: BuildOptions) {
  await unarchive(`https://github.com/p11-glue/p11-kit/releases/download/${version}/p11-kit-${version}.tar.xz`);

  // because otherwise it tries to install to /etc/p11-kit
  Deno.env.set("DESTDIR", prefix.string);

  run`meson setup bld
      --prefix=/usr/local
      --buildtype=release
      -Dtrust_module=disabled
      -Dsysconfdir=/etc
      -Dgtk_doc=false
      `;
  run`ninja -C bld`
  run`ninja -C bld install`;

  for await (const [path] of prefix.join("usr/local").ls()) {
    path.mv({ into: prefix });
  }
  prefix.join("usr/local").rm().parent().rm();

  // we disable the trust module, but all the same let’s fix this
  inreplace(
    prefix.lib.join("pkgconfig/p11-kit-1.pc"),
    /p11_trust_paths=.*/,
    'p11_trust_paths=${pcfiledir}/../../../../curl.se/ca-certs/v*/share/ca-certs.pem');
}
