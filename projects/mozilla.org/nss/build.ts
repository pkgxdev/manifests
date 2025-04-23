import { stub, BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  const url = `https://ftp.mozilla.org/pub/security/nss/releases/${tag}/src/nss-${version.marketing}.tar.gz`;
  const opts = { stripComponents: 1 };
  await unarchive(url, opts);

  // requires `gyp` and is basically the only thing that ever needs it
  // so we we aren’t packaging it RN
  run`python3 -m venv gyp`;
  run`gyp/bin/pip install gyp-next`;

  Deno.env.set("PATH", `${Path.cwd().join("gyp/bin")}:${Deno.env.get("PATH")}`);

  if (Deno.build.os == 'linux') {
    // needed for readelf
    stub({ pkgspec: "gnu.org/binutils", program: "readelf"});

    // assumes gnu `as` even though we specify `--clang` and passes invalid args
    stub({ pkgspec: "gnu.org/binutils", program: "as" });
  }

  Path.cwd().join("nss").cd();
  run`./build.sh
        --python=python3
        --with-nspr=${deps['mozilla.org/nspr'].prefix}/include/nspr:${deps['mozilla.org/nspr'].prefix}/lib
        --clang
        --system-sqlite
        -Dsign_libs=0    # or fails with signing error on macOS
        --opt
        --disable-tests
        `;

    const dist = Path.cwd().parent().join("dist");
    dist.join("Release").mv({ to: prefix.mkparent() });
    dist.join("public").mv({ to: prefix.include });

    prefix.lib.join("pkgconfig/nss.pc").mkparent().write(
      props.join("nss.pc.in").read().replace("{{version}}", `${version}`)
    );

    for await (const file of prefix.lib.glob("*.TOC")) {
      file.rm();
    }
}
