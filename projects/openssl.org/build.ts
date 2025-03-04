import { env_include, BuildOptions, Range, run, SemVer, unarchive } from "brewkit";

export default async function ({ prefix, version, props }: BuildOptions) {
  await unarchive(`https://www.openssl.org/source/openssl-${version}.tar.gz`);

  let extra = "";
  if (Deno.build.os == 'windows') {
    env_include('nasm.us');
  } else {
    // doesn’t build on windows
    // supposedly important optimization
    extra = "enable-ec_nistp_64_gcc_128";
    // windows is built to be relocatable but other platforms are not
    run`patch -p1 --input ${props}/relocatable.diff`;
  }
  if (Deno.build.os != 'darwin') {
    env_include('perl');
  }

  run`
    perl
    ./Configure
    --prefix=${prefix}
    ${target(version)}
    no-tests
    ${extra}
    --openssldir=/etc/ssl
    `;

  if (Deno.build.os != 'windows') {
    run`make --jobs ${navigator.hardwareConcurrency}`;
    run`make install_sw`;
  } else {
    run`nmake`;
    run`nmake install_sw`;
  }

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
