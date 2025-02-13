import { BuildOptions, Range, run, unarchive } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://www.openssl.org/source/openssl-${version}.tar.gz`);

  let target = "";
  if (new Range("^1").satisfies(version)) {
    switch (`${Deno.build.os}/${Deno.build.arch}`) {
      case "darwin/aarch64":
        target = "darwin64-arm64-cc";
        break;
      case "darwin/x86-64":
        target = "darwin64-x86_64-cc";
        break;
      case "linux/aarch64":
        target = "linux-aarch64";
        break;
      case "linux/x86-64":
        target = "linux-x86_64";
        break;
      default:
        throw new Error(
          `unsupported platform: ${Deno.build.os}/${Deno.build.arch}`,
        );
    }
  }

  run`
    perl
    ./Configure
    --prefix=${prefix}
    ${target}
    no-tests
    enable-ec_nistp_64_gcc_128
    --openssldir=/etc/ssl
    `;
  // ^^ enable-ec_nistp_64_gcc_128 = supposedly important optimization
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install_sw`;

  // weird choices from openssl here
  prefix.join("lib64").isDirectory()?.mv({ to: prefix.join("lib") });
}
