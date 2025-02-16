import { BuildOptions, ensure, env_include, Range, run, SemVer, unarchive } from "brewkit";

export default async function ({ prefix, version, props }: BuildOptions) {
  await unarchive(`https://www.openssl.org/source/openssl-${version}.tar.gz`);

  let extra = [];
  if (Deno.build.os == "windows") {
    env_include("nasm.us");
  } else {
    extra.push("--openssldir=/etc/ssl");
    // supposedly important optimization (doesn’t build on Windows)
    extra.push("enable-ec_nistp_64_gcc_128");
    // windows is built to be relocatable but other platforms are not
    run`patch -p1 --input ${props}/relocatable.diff`;
  }

  ensure("perl");

  run`
    perl
    ./Configure
    --prefix=${prefix}
    ${target(version)}
    --libdir=lib  # prevent picking lib64
    no-tests
    ${extra.join(" ")}
    `;

  if (Deno.build.os == "windows") {
    run`nmake`;
    run`nmake install`;
  } else {
    run`make --jobs ${navigator.hardwareConcurrency}`;
    run`make install_sw`;
  }
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
