import { BuildOptions, inreplace, run, unarchive } from "brewkit";

export default async function ({ prefix, version, deps }: BuildOptions) {
  await unarchive(`https://curl.se/download/curl-${version}.tar.gz`);

  if (Deno.build.os == "windows") {
    run`cmake .
          -B build
          -DCMAKE_INSTALL_PREFIX=${prefix}
          -DZLIB_INCLUDE_DIR=${deps["zlib.net"].prefix}/include
          -DZLIB_LIBRARY=${deps["zlib.net"].prefix}/lib/zlib.lib
          -DCURL_USE_LIBPSL=OFF
          -DBUILD_TESTING=OFF
          -DCURL_USE_SCHANNEL=ON
          `;
    run`cmake --build build --config Release --target install`;
  } else {
    const args = [
      `--prefix=${prefix}`,
      "--without-libpsl", //causes weird downstream bugs in php
    ];

    switch (Deno.build.os) {
      case "linux":
        args.push(
          "--with-openssl",
          "--with-ca-fallback", //uses openssl’s certs (which we control)
        );
        break;
      case "darwin":
        args.push(
          "--with-secure-transport", // use macOS’s native TLS
        );
    }

    run`./configure ${args.join(" ")}`;
    run`make --jobs ${navigator.hardwareConcurrency} install`;

    inreplace(
      prefix.join("bin/curl-config"),
      /^prefix='.+'$/gm,
      'prefix="$(cd "$(dirname "$0")"/.. && pwd)"',
    );
  }
}
