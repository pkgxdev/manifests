import { BuildOptions, unarchive, run, inreplace } from "brewkit";

export default async function ({ prefix, version, props, deps }: BuildOptions) {
  await unarchive(`https://download.gnome.org/sources/libxslt/${version.marketing}/libxslt-${version}.tar.xz`);
    run`patch -p1 --input ${props}/xslt-config.patch.in`;
    run`./configure --prefix=${prefix} --without-python --without-plugins`;
    run`make --jobs ${navigator.hardwareConcurrency}`;
    run`make install`;

    inreplace(prefix.bin.join("xslt-config"), deps['gnome.org/libxml2'].prefix.string, "$libxml2_prefix");
}
