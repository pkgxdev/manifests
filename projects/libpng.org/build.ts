import { BuildOptions, run, unarchive } from "brewkit";

export default async function({ version, prefix }: BuildOptions) {
  await unarchive(`https://cytranet.dl.sourceforge.net/project/libpng/libpng${version.major}${version.minor}/${version}/libpng-${version}.tar.xz`);
  run`./configure
        --disable-dependency-tracking
        --disable-silent-rules
        --prefix ${prefix}`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;
}
