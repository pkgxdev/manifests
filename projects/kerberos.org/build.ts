import { BuildOptions, unarchive, run, ensure, Path, inreplace } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://kerberos.org/dist/krb5/${version.marketing}/${tag}.tar.gz`);
  ensure('bison');
  Path.cwd().join("src").cd();
  run`./configure
        --prefix=${prefix}
        --disable-nls
        --without-system-verto
        --without-keyutils
        --sysconfdir=/etc
        --localstatedir=/var
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;

  inreplace(prefix.bin.join("krb5-config"), `prefix=${prefix}`, 'prefix="$(cd $(dirname $0)/.. && pwd)"');
}
