import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://curl.se/download/curl-${version}.tar.bz2`);

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
}
