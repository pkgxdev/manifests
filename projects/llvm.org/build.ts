import { BuildOptions, env_include, Path, run, SemVer, unarchive } from "brewkit";

// # resources
// * https://llvm.org/docs/BuildingADistribution.html

// # TODO
// the compiler-rt stuff is really only needed for llvm-specific builds like python
// everything else builds without it, so we ideally could split that out into a subpkg
// NOTE that we use the glibc runtime package provided by debian-slim to build without
// these. Which puts that onus on end-users who want to build c programs on top of our
// llvm.

export default async function build({ prefix, version, tag, deps }: BuildOptions) {
  await unarchive(
    `https://github.com/llvm/llvm-project/releases/download/${tag}/llvm-project-${version}.src.tar.xz`,
  );

  // build what is provided by GNU “bintools”
  let tools = "clang;lld;llvm-ar;llvm-as;llvm-nm;llvm-objdump;llvm-size;llvm-strings;llvm-objcopy;llvm-ranlib";

  let platform_specific_cmake_args = "";

  switch (Deno.build.os) {
    case "linux":
      // env_include("llvm.org");

      //using lld speeds things up, the other keeps us GNU glibc by default
      platform_specific_cmake_args = `
        -DCLANG_DEFAULT_RTLIB=libgcc
        -DCLANG_DEFAULT_LINKER=lld
        -DDCLANG_DEFAULT_CXX_STDLIB=libstdc++
        -DCLANG_DEFAULT_UNWINDLIB=libgcc
        -DLLVM_ENABLE_PER_TARGET_RUNTIME_DIR=ON  # needed to find gcc shit at runtime
        `;

      // compiler-rt specific stuff
      platform_specific_cmake_args += `
        -DCMAKE_C_COMPILER_TARGET=x86_64-unknown-linux-gnu
        `;
      break;

    case "darwin":
      platform_specific_cmake_args = `
        -DLLVM_ENABLE_EXPORTED_SYMBOLS_IN_EXECUTABLES=OFF
        -DDEFAULT_SYSROOT=/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk
        `;
  }

  run`cmake
        -S ./llvm
        -B ./o
        -G Ninja
        -Wno-dev

        -DCMAKE_INSTALL_PREFIX=${prefix}

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

        -DLLVM_ENABLE_PROJECTS=clang;lld
        -DLLVM_DISTRIBUTION_COMPONENTS=${tools}
        -DLLVM_TOOLCHAIN_TOOLS=${tools}

        -DCLANG_ENABLE_STATIC_ANALYZER=OFF  # recommended by the LLVM build guide
        -DLLVM_ENABLE_Z3_SOLVER=OFF         # required for ^^
        -DCLANG_ENABLE_ARCMT=OFF

        -DLLVM_ENABLE_LIBCXX=OFF   # seems weird but we don’t want this, we delegate to the system

        ${platform_specific_cmake_args}
        `;

  run`ninja -C ./o distribution`;
  run`ninja -C ./o install-distribution-stripped`;
  run`ninja -C ./o install-clang-resource-headers`; // FIXME necessary header files or builds just don’t work

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
