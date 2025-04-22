import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://poppler.freedesktop.org/poppler-data-${version}.tar.gz`);
  run`make install
        prefix=${prefix}
        datadir=${prefix}/lib
        pkgdatadir=${prefix}/share/poppler
        `;
  // - 'ln -s {{prefix}}/lib/pkgconfig {{prefix}}/share/'
}