import { BuildOptions, Range, run, SemVer, unarchive } from "brewkit";

export default async function ({ prefix, version, props }: BuildOptions) {
  await unarchive(`https://www.openssl.org/source/openssl-${version}.tar.gz`);

  run`patch -p1 --input ${props}/relocatable.diff`;

  run`
    perl
    ./Configure
    --prefix=${prefix}
    ${target(version)}
    no-tests
    enable-ec_nistp_64_gcc_128
    --openssldir=/etc/ssl
    `;
  // ^^ enable-ec_nistp_64_gcc_128 = supposedly important optimization

  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install_sw`;

  // weird choices from openssl here
  prefix.join("lib64").isDirectory()?.mv({ to: prefix.lib });
}

function target(version: SemVer) {
  if (!new Range("^1").satisfies(version)) return "";
  switch (`${Deno.build.os}/${Deno.build.arch}`) {
    case "darwin/aarch64":
      return "darwin64-arm64-cc";
    case "darwin/x86-64":
      return "darwin64-x86_64-cc";
    case "linux/aarch64":
      return "linux-aarch64";
    case "linux/x86-64":
      return "linux-x86_64";
    default:
      throw new Error("unsupported platform");
  }
}
