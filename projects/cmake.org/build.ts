import { BuildOptions, run, unarchive } from "brewkit";

//TODO has more deps that it vendors
// use --sysmem-libs to use them

export default async function ({ prefix, deps, version }: BuildOptions) {
  await unarchive(`https://github.com/Kitware/CMake/releases/download/v${version}/cmake-${version}.tar.gz`);

  const extra_args = Deno.build.os == "linux"
    ? `-DZLIB_LIBRARY=${deps["zlib.net"].prefix}/lib/libz.so
       -DZLIB_INCLUDE_DIR=${deps["zlib.net"].prefix}/include
       -DCURL_LIBRARY=${deps["curl.se"].prefix}/lib/libcurl.so
       -DCURL_INCLUDE_DIR=${deps["curl.se"].prefix}/include
       -DBZIP2_LIBRARIES=${deps["sourceware.org/bzip2"].prefix}/lib/libbz2.so
       -DBZIP2_INCLUDE_DIR=${deps["sourceware.org/bzip2"].prefix}/include`
    : "";

  run`./bootstrap
        --prefix=${prefix}
        --docdir=/share/doc
        --mandir=/share/man
        --system-zlib
        --system-curl
        --system-bzip2
        --
        -DCMake_BUILD_LTO=ON
        -DCMAKE_BUILD_TYPE=Release
        -DCMAKE_VERBOSE_MAKEFILE:BOOL=ON
        ${extra_args}
        `;
  run`make --jobs ${navigator.hardwareConcurrency} install`;

  // we have a “docs are on the Internet” policy
  prefix.share.join(`cmake-${version.marketing}/Help`).rm("rf");
}
