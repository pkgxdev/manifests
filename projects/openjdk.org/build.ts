import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ version, tag, prefix }: BuildOptions) {
  await unarchive(`https://github.com/openjdk/jdk${version.major}u/archive/${tag}.tar.gz`);

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

  //   - run: >
//       ARGS+=" --disable-hotspot-gtest --with-jvm-features=shenandoahgc
//       --with-conf-name=release"
//
//       MAKE_ARGS+=" CONF=release"
//
//
//       # This is hacky, but it's necessary to version the LLVM dependency by
//       openjdk version.
//
//       if test {{hw.platform}} = "linux"; then
//         LLVM_VERSION_MAJOR='12'
//         pkgx "+llvm.org^${LLVM_VERSION_MAJOR}"
//         LLVM_BIN_PATH="$(realpath "{{deps.llvm.org.prefix}}/../v${LLVM_VERSION_MAJOR}/bin")"
//         PATH_WITHOUT_LLVM="$(echo "${PATH}" | tr ':' '\n' | grep -v '/llvm.org/' | tr '\n' ':')"
//         export PATH="${LLVM_BIN_PATH}:${PATH_WITHOUT_LLVM}"
//         clang --version | grep "clang version ${LLVM_VERSION_MAJOR}"
//         unset LLVM_VERSION_MAJOR LLVM_BIN_PATH PATH_WITHOUT_.LLVM
//       fi
//     if: <12

  const BOOT_JDK_DIR = Deno.build.os === "darwin" ? "boot-jdk/Contents/Home" : "boot-jdk";

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
      --with-vendor-version-string="pkgx^2"
       `;
    run`make --jobs ${navigator.hardwareConcurrency} images`;

    if (Deno.build.os === "darwin") {
      for await (const path of Path.cwd().glob(`build/*/images/jdk-bundle/jdk-${version}.jdk/Contents/Home/*`)) {
        path.mv({ into: prefix.mkdir() });
      }
    } else {
      for await (const path of Path.cwd().glob("build/*/images/jdk/*")) {
        path.mv({ into: prefix.mkdir() });
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
