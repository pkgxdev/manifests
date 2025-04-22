import { backticks_quiet, BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ version, tag, prefix, deps }: BuildOptions) {
  await unarchive(`https://github.com/openjdk/jdk${version.major}u/archive/${tag}.tar.gz`);

  // the boot jdk should point to the last version of the previous major version
  // or the last previous version of the current major version
  //TODO compute this from web data!
  const BOOT_JDK_ARCH = (() => {
    switch (process.platform) {
      case "darwin":
        return process.arch === "arm64" ? "aarch64_mac" : "x64_mac";
      case "linux":
        return process.arch === "arm64" ? "aarch64_linux" : "x64_linux";
      default:
        throw new Error(`Unsupported platform: ${process.platform}`);
    }
  })();
  const BOOT_JDK_VERSION = "21.0.2+13";
  const BOOT_JDK_MAJOR = 21;

  Path.cwd().join("boot-jdk").mkdir().cd();
  await unarchive(`https://github.com/adoptium/temurin${BOOT_JDK_MAJOR}-binaries/releases/download/jdk-${BOOT_JDK_VERSION}/OpenJDK${BOOT_JDK_MAJOR}U-jdk_${BOOT_JDK_ARCH}_hotspot_${BOOT_JDK_VERSION.replace("+", "_")}.tar.gz`)
  Path.cwd().parent().cd();

  const BOOT_JDK_DIR = Deno.build.os === "darwin" ? "boot-jdk/Contents/Home" : "boot-jdk";

  const pkgx_version = backticks_quiet`pkgx --version`;

  const extra = Deno.build.os === "darwin"
    ? `--enable-dtrace
       --with-sysroot=/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk
       `
    : `--with-x=${deps['x.org/x11'].prefix}
       --with-cups=${deps['github.com/OpenPrinting/cups'].prefix}
       --with-fontconfig=${deps['freedesktop.org/fontconfig'].prefix}
       --with-freetype=system
       --with-stdc++lib=dynamic
       --with-toolchain-type=clang
       CXXFILT=llvm-cxxfilt`;

  run`bash ./configure
      --with-boot-jdk=${BOOT_JDK_DIR}
      --disable-warnings-as-errors
      --with-debug-level=release
      --with-jvm-variants=server
      --with-native-debug-symbols=none
      --with-vendor-bug-url=https://github.com/pkgxdev/pantry/issues
      --with-vendor-name=pkgx
      --with-vendor-url=https://github.com/pkgxdev/pantry/issues
      --with-vendor-vm-bug-url=https://github.com/pkgxdev/pantry/issues
      --with-version-opt=
      --with-version-pre=
      --with-giflib=system
      --with-harfbuzz=system
      --with-lcms=system
      --with-libjpeg=system
      --with-libpng=system
      --with-zlib=system
      --with-version-build=${version.major}
      --with-vendor-version-string=${pkgx_version.replace(/\s+/, "-")}
      ${extra}
       `;
    run`make JOBS=${navigator.hardwareConcurrency} images`;

    if (Deno.build.os === "darwin") {
      for await (const path of Path.cwd().glob(`build/*/images/jdk-bundle/jdk-${version}.jdk/Contents/Home/*`)) {
        path.mv({ into: prefix.mkdir('p') });
      }
    } else {
      for await (const path of Path.cwd().glob("build/*/images/jdk/*")) {
        path.mv({ into: prefix.mkdir('p') });
      }
    }

//   - run: |
//       # jni.h:45:10: fatal error: 'jni_md.h' file not found
//       if test -d {{ hw.platform }}; then
//         mv {{ hw.platform }}/* .
//         rmdir {{ hw.platform }}
//         ln -s . {{ hw.platform }}
//       fi
//     working-directory: '${{prefix}}/include'
}
