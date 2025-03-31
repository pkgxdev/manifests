import { BuildOptions, env_include, Path, run, SemVer, unarchive } from "brewkit";

export default async function build({ prefix, version, tag, deps }: BuildOptions) {
  await unarchive(
    `https://github.com/llvm/llvm-project/releases/download/${tag}/llvm-project-${version}.src.tar.xz`,
  );

  run`cmake
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

        -DLLVM_ENABLE_PROJECTS=llvm-profdata
        -DLLVM_DISTRIBUTION_COMPONENTS=llvm-profdata
        -DLLVM_TOOLCHAIN_TOOLS=llvm-profdata

        -DCLANG_ENABLE_STATIC_ANALYZER=OFF  # recommended by the LLVM build guide
        -DLLVM_ENABLE_Z3_SOLVER=OFF         # required for ^^
        -DCLANG_ENABLE_ARCMT=OFF

        -DCOMPILER_RT_DEFAULT_TARGET_ONLY=ON
        -DCMAKE_C_COMPILER_TARGET=x86_64-unknown-linux-gnu
        -DLLVM_ENABLE_RUNTIMES=compiler-rt
        -DCOMPILER_RT_BUILD_XRAY=OFF
        -DCOMPILER_RT_BUILD_LIBFUZZER=OFF
        -DZLIB_INCLUDE_DIR=${deps['zlib.net'].prefix}/include
        -DZLIB_LIBRARY=${deps['zlib.net'].prefix}/lib/libz.so

        -DCLANG_DEFAULT_RTLIB=libgcc
        -DCLANG_DEFAULT_LINKER=lld
        `;

  run`ninja -C ./o distribution`;
  run`ninja -C ./o install-distribution-stripped`;
  run`ninja -C ./o install-compiler-rt-stripped`;
}
