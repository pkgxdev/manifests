import { BuildOptions, env_include, Path, run, unarchive } from "brewkit";
import { walk, WalkOptions } from "jsr:@std/fs@1/walk";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://static.rust-lang.org/dist/rust-${version}-${Deno.build.target}.tar.xz`);

  const opts: WalkOptions = {
    maxDepth: 2,
    includeDirs: true,
    includeFiles: false,
    includeSymlinks: false,
  };

  for await (const { name, ...entry } of walk(".", opts)) {
    const path = Path.cwd().join(entry.path);
    switch (name) {
      case "bin":
      case "etc":
      case "lib":
      case "libexec":
      case "share":
        await merge(path, prefix.join(name).mkdir("p"));
    }
  }

  prefix.bin.join("rls").rm(); // deprecated
  prefix.lib.join("rustlib/aarch64-apple-darwin/analysis").rm("rf"); // just a weird json file

  for await (const [path, { name }] of prefix.lib.join(`rustlib/${Deno.build.target}/bin`).ls()) {
    if (name !== "rust-objcopy") {
      path.rm("rf");
    }
  }
}

async function merge(src: Path, dest: Path) {
  for await (const entry of Deno.readDir(src.string)) {
    const srcPath = src.join(entry.name);
    const destPath = dest.join(entry.name);

    if (entry.isFile) {
      srcPath.mv({ to: destPath });
    } else if (entry.isDirectory) {
      await merge(srcPath, destPath.mkdir());
    }
  }
}

export async function build_from_source({ prefix, version }: BuildOptions) {
  await unarchive(`https://static.rust-lang.org/dist/rustc-${version}-src.tar.gz`);

  env_include("cmake ninja python~3.9 openssl.org^3");

  if (Deno.build.os == "darwin") {
    // fix machos needs this
    Deno.env.set("RUSTFLAGS", "-C link-args=-headerpad_max_install_names");
  }

  run`./configure
        --enable-vendor
        --prefix=${prefix}
        --enable-ninja
        --disable-docs   # docs are online
        --tools=clippy,rustdoc,rustfmt,analysis
        --sysconfdir=/etc`;
  run`make install`;
}
