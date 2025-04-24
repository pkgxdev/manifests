import { BuildOptions, unarchive, run, inreplace } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://dlcdn.apache.org/apr/apr-${version}.tar.gz`);
  run`./configure --prefix=${prefix} --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;

  inreplace(prefix.bin.join(`apr-${version.major}-config`),
    prefix.string,
    '"$(cd "$(dirname "$0")"/.. && pwd)"');

//   cd ../build-1
//
//   sed -i.bak \
//     -e "s_${prefix}_\$(subst /bin/apr-{{version.major}}-config,,\$(shell command -v apr-{{version.major}}-config))_g" \
//     -e "s_${PKGX_DIR}_\$(subst /apache.org/apr/v{{version}}/bin/apr-{{version.major}}-config,,\$(shell command -v apr-{{version.major}}-config))_g" \
//     apr_rules.mk
//   rm apr_rules.mk.bak
}