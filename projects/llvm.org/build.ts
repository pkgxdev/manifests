import { BuildOptions, env_include, Path, run, SemVer, unarchive } from "brewkit";

// # resources
// * https://llvm.org/docs/BuildingADistribution.html

// # TODO
// the compiler-rt stuff is really only needed for llvm-specific builds like python
// everything else builds without it, so we ideally could split that out into a subpkg
// NOTE that we use the glibc runtime package provided by debian-slim to build without
// these. Which puts that onus on end-users who want to build c programs on top of our
// llvm.

export default async function build({ prefix, version, tag }: BuildOptions) {
  await unarchive(
    `https://github.com/llvm/llvm-project/releases/download/${tag}/llvm-project-${version}.src.tar.xz`,
  );

  env_include("ninja cmake");

  // build what is provided by GNU “bintools”
  let tools = "llvm-ar;llvm-as;llvm-nm;llvm-objdump;llvm-size;llvm-strings;llvm-objcopy;llvm-ranlib";

  // TODO subpkg for this, and another for the compiler-rt stuff
  tools += ";llvm-profdata";

  let platform_specific_cmake_args = "";
  let projects = "clang;lld";
  let extra_targets = "";

  switch (Deno.build.os) {
    case "linux":
      env_include("python^3 llvm.org");

      //using lld speeds things up, the other keeps us GNU glibc by default
      platform_specific_cmake_args = `
      -DCLANG_DEFAULT_RTLIB=libgcc
      -DCLANG_DEFAULT_LINKER=lld
      `;

      // compiler-rt specific stuff
      platform_specific_cmake_args += `
      -DCOMPILER_RT_DEFAULT_TARGET_ONLY=ON
      -DCMAKE_C_COMPILER_TARGET=x86_64-unknown-linux-gnu
      -DLLVM_ENABLE_RUNTIMES=compiler-rt
      -DCOMPILER_RT_BUILD_XRAY=OFF
      -DCOMPILER_RT_BUILD_LIBFUZZER=OFF
      `;

      extra_targets = "compiler-rt";
      break;

    case "darwin":
      platform_specific_cmake_args = `
      -DLLVM_ENABLE_EXPORTED_SYMBOLS_IN_EXECUTABLES=OFF
      -DDEFAULT_SYSROOT=/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk
      `;
  }

  /*
    CLANG_ENABLE_STATIC_ANALYZER=OFF
      - recommended by the LLVM build guide
    LLVM_ENABLE_Z3_SOLVER=OFF
      - required for the above
   */

  run`cmake
    --log-level=DEBUG
        -S ./llvm
        -B ./o
        -G Ninja

        -DCMAKE_INSTALL_PREFIX=${prefix}
        -DCMAKE_BUILD_TYPE=Release

        -DCLANG_VENDOR=pkgx
        -DBUG_REPORT_URL=https://github.com/pkgxdev/pantry/issues/new

        -DLLVM_ENABLE_RTTI=ON
        -DLLVM_ENABLE_LTO=Full
        -DLLVM_ENABLE_ZLIB=FORCE_ON
        -DLLVM_ENABLE_OCAMLDOC=OFF
        -DLLVM_ENABLE_BINDINGS=OFF
        -DLLVM_ENABLE_LIBEDIT=OFF
        -DLLVM_ENABLE_BACKTRACES=OFF
        -DLLVM_ENABLE_ASSERTIONS=OFF
        -DLLVM_ENABLE_DOXYGEN=OFF
        -DLLVM_ENABLE_SPHINX=OFF

        -DLLVM_INSTALL_TOOLCHAIN_ONLY=ON

        -DLLVM_INCLUDE_DOCS=OFF
        -DLLVM_INCLUDE_TESTS=OFF
        -DLLVM_INCLUDE_BENCHMARKS=OFF
        -DLLVM_INCLUDE_EXAMPLES=OFF

        -DLLVM_BUILD_TESTS=OFF
        -DCOMPILER_RT_INCLUDE_TESTS=OFF
        -DCOMPILER_RT_USE_LIBCXX=OFF

        -DLLVM_ENABLE_PROJECTS=${projects}
        -DLLVM_DISTRIBUTION_COMPONENTS=clang;lld;${tools}
        -DLLVM_TOOLCHAIN_TOOLS=${tools}

        -DCLANG_ENABLE_STATIC_ANALYZER=OFF
        -DLLVM_ENABLE_Z3_SOLVER=OFF
        -DCLANG_ENABLE_ARCMT=OFF

        ${platform_specific_cmake_args}
        `;

  run`ninja -C ./o distribution ${extra_targets}`;
  run`ninja -C ./o install-distribution-stripped`;
  if (Deno.build.os === "linux") {
    run`ninja -C ./o install-compiler-rt-stripped`;
  }
  run`ninja -C ./o install-clang-resource-headers`; // necessary header files or builds just don’t work

  const bin = prefix.join("bin");
  kthxbai_clang_version_suffix(bin, version);
  create_bintools_symlinks(bin);
}

function kthxbai_clang_version_suffix(bin: Path, version: SemVer) {
  bin.join(`clang-${version.major}`).mv({ to: bin.join("clang").rm() });
}

function create_bintools_symlinks(bin: Path) {
  for (const tool of "as ar nm strings objdump ranlib".split(" ")) {
    const target = `llvm-${tool}`;
    bin.join(tool).ln("s", { target });
  }
  bin.join("cc").ln("s", { target: "clang" });
  bin.join("c++").ln("s", { target: "clang++" });

  // failure all over when using this symlink on macOS
  if (Deno.build.os != "darwin") {
    bin.join("ld").ln("s", { target: "lld" });
  }

  bin.join("llvm-strip").ln("s", { target: "llvm-objcopy" });
  bin.join("strip").ln("s", { target: "llvm-objcopy" });
}
