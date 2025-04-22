import { BuildOptions, unarchive, run, inreplace } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://www.openldap.org/software/download/OpenLDAP/openldap-release/openldap-${version}.tgz`);

  if (Deno.build.os === "linux") {
    Deno.env.set("CFLAGS", "-Wl,--undefined-version");
  }

  run`./configure
        --prefix=${prefix}
        --enable-accesslog
        --enable-auditlog
        --enable-constraint
        --enable-dds
        --enable-deref
        --enable-dyngroup
        --enable-dynlist
        --enable-memberof
        --enable-ppolicy
        --enable-proxycache
        --enable-refint
        --enable-retcode
        --enable-seqmod
        --enable-translucent
        --enable-unique
        --enable-valsort
        --without-systemd
      `;

  // avoid needing groff to build the docs
  inreplace('Makefile', /SUBDIRS=(.*)\bdoc\b(.*)/, 'SUBDIRS=$1$2');

  run`make --jobs ${navigator.hardwareConcurrency} install`;
}