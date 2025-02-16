import { BuildOptions, env_include, inreplace, Path, run, SemVer, unarchive } from "brewkit";

export default async function (
  { tag, prefix, deps, version, props }: BuildOptions,
) {
  tag = tag.replace(/^v/, "");
  await unarchive(
    `https://www.python.org/ftp/python/${tag}/Python-${tag}.tar.xz`,
  );

  if (Deno.build.os == "linux") {
    // --enable-optimizations requires llvm-profdata
    await env_include("llvm.org");
  }

  if (version.lt(new SemVer("3.12"))) {
    inreplace(
      Path.cwd().join("setup.py"),
      /system_lib_dirs = .*/g,
      `system_lib_dirs = os.getenv("LIBRARY_PATH").split(":")`,
    );
    inreplace(
      Path.cwd().join("setup.py"),
      /system_include_dirs = .*/g,
      `system_include_dirs = os.getenv("CPATH").split(":")`,
    );
  }

  //NOTE clang required for --enable-optimizations
  //TODO  --enable-bolt reduces end filesize (requires llvm-bolt)
  run`./configure
        --prefix=${prefix}
        --with-openssl=${deps["openssl.org"].prefix}
        --with-system-expat
        --with-system-ffi
        --with-system-libmpdec
        --enable-shared
        --enable-optimizations
        --with-lto=full
        --without-ensurepip
        --disable-test-modules
        --enable-loadable-sqlite-extensions
        --with-configdir=/etc/python
        CC=clang
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;

  props.join("sitecustomize.py").cp({ into: prefix.lib.join(`python${version.marketing}`) });

  // provide unversioned binaries
  const v = `${version.major}.${version.minor}`;
  prefix.join("bin/python").ln("s", { target: `python${v}` });
  prefix.join("bin/pydoc").ln("s", { target: `pydoc${v}` });
  prefix.join("bin/python-config").ln("s", { target: `python${v}-config` });

  // idle is prehistoric and nobody wants it
  prefix.join(`bin/idle${v}`).rm();
  prefix.join(`bin/idle${version.major}`).rm();
  prefix.join(`lib/python${v}/idlelib`).rm("rf");
}
