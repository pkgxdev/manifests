import { env_include, BuildOptions, unarchive, run, inreplace } from "brewkit";

export default async function ({ prefix, version, deps }: BuildOptions) {
  await unarchive(`https://github.com/p11-glue/p11-kit/releases/download/${version}/p11-kit-${version}.tar.xz`);

  // because otherwise it tries to install to /etc/p11-kit
  Deno.env.set("DESTDIR", prefix.string);

  run`./configure
        --prefix=/usr/local
        --with-trust-paths=${deps['curl.se/ca-certs'].prefix}/share/ca-certs.pem
        --disable-debug
        --sysconfdir=/etc
        --localstatedir=/var
        --disable-doc
        `;
  run`make -j ${navigator.hardwareConcurrency} install`;

  for await (const [path] of prefix.join("usr/local").ls()) {
    path.mv({ into: prefix });
  }
  prefix.join("usr/local").rm().parent().rm();

  prefix.share.join("gtk-doc").rm('rf');

  inreplace(
    prefix.lib.join("pkgconfig/p11-kit-1.pc"),
    /p11_trust_paths=.*/,
    'p11_trust_paths=${pcfiledir}/../../../../curl.se/ca-certs/v*/share/ca-certs.pem');
}
