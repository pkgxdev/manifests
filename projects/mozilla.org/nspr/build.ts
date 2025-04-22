import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  const url = `https://archive.mozilla.org/pub/nspr/releases/${tag}/src/nspr-${tag.slice(1)}.tar.gz`;
  await unarchive(url, { stripComponents: 2 });
  // script:
//   - run: |
//       sed -i.bak 's|@executable_path|{{prefix}}/lib|g' configure
//       rm configure.bak
//     if: darwin
//     working-directory: nspr

  run`./configure
        --prefix=${prefix}
        --disable-debug
        --enable-optimize
        --enable-strip
        --with-pthreads
        --enable-ipv6
        --enable-64bit
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;
}