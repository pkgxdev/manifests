#!/usr/bin/env -S pkgx deno^2 run -A

import { parse, Path, SemVer } from "brewkit";
import { fromFileUrl } from "jsr:@std/path@1/from-file-url";
import parse_deps from "../brewkit/scripts/deps-env.ts";

const pkg = parse(Deno.args[0]);
const srcroot = new Path(fromFileUrl(import.meta.url)).parent().parent();
const tmpdir = mktempd();
const deno = "deno";

// copying pantry into tmpdir as weird issues with parallels shared folders
// that make pkgx fail to write db with “access denied” messages
srcroot.join("artifacts/pantry").cp({ into: tmpdir });

Deno.env.set('PKGX_PANTRY_DIR', tmpdir.join("pantry").string);
Deno.env.set('PKGX_DIST_URL', "https://dist.pkgx.dev/v2");

await prep_deps();
await prep_script();
await run();
await post();

//Deno.removeSync(tmpdir, { recursive: true });

async function prep_script() {
  let src = "";
  const root = srcroot.join("projects", pkg.project);

  let foo: Path | undefined;
  if (foo = root.join("versions.ts").isFile()) {
    src += `import versions from "${foo.fileURL()}";\n`;
  } else {
    src += "import { default_versions } from 'brewkit';\n";
    src += `const versions = default_versions("${root.join("package.yml").string.replaceAll("\\", "\\\\")}");\n`;
  }
  if (foo = root.join("fixup.ts").isFile()) {
    src += `import process_fixup from "${foo.fileURL()}";\n`;
  } else {
    src += "const process_fixup = () => true;\n";
  }

  src += `import build from "${root.join("build.ts").fileURL()}";\n`;
  src += await srcroot.join("brewkit/build-template.ts").read();

  tmpdir.join("run-build.ts").write(src);

  tmpdir.join("deno.json").write(
    `{"imports": {"brewkit": "${srcroot.join("brewkit/mod.ts").fileURL()}"}}`
  );

  srcroot.join("deno.lock").cp({ into: tmpdir });
}

async function prep_deps() {
  let foo: Path | undefined;
  if (foo = srcroot.join("artifacts", platform_partial_path()).isDirectory()) {
    foo.cp({ to: tmpdir.join("deps") });
  }

  Deno.env.set("PKGX_DIR", tmpdir.join("deps").string);

  const json = await parse_deps(pkg.project);

  if (json) {
    const SEP = Deno.build.os == "windows" ? ";" : ":";

    for (const [key, paths] of Object.entries(json.env) as [string, string[]][]) {
      let value = paths.join(SEP);
      if (Deno.env.get(key)) {
        value += `${SEP}\${${key}}`;
      }
      Deno.env.set(key, value);
    }

    for (const [_pkg, env_dict] of Object.entries(json.runtime_env)) {
      for (let [key, value] of Object.entries(env_dict as any)) {
        const { path } = json.pkgs.find(({ project }: any) => project === _pkg);
        value = (value as string).replace("{{prefix}}", path);
        Deno.env.set(key, value as string);
      }
    }

    const pkgs = Object.values(json.pkgs).map(({ path }: any) => path);
    Deno.env.set("PKGS", pkgs.join(SEP));
  }
}

async function run() {
  //NOTE --allow-all is required for Windows, dunno why but whatever
  const args = [
    "run",
    "--quiet",
    "--allow-all",
    tmpdir.join("run-build.ts").string,
    `${pkg.project}${pkg.constraint.toString() == '*' ? '' : pkg.constraint}`,
    tmpdir.join("src").string,
    srcroot.join("projects", pkg.project).string,
    tmpdir.join("deps").string,
    tmpdir.join("prefix").string,
  ];
  const proc = new Deno.Command(deno, { args }).spawn();
  const { code, success } = await proc.status;
  if (!success) {
    Deno.exit(code);
  }
}

async function post() {
  const receipt = tmpdir.join("build-receipt.json")
  const version = new SemVer(JSON.parse(await receipt.read()).version);
  const root = srcroot.join("artifacts", platform_partial_path(), pkg.project).mkdir('p');
  const dstdir = root.join(`v${version}`);

  dstdir.rm('rf');

  if (Deno.build.os == "windows" && tmpdir.drive() != dstdir.drive()) {
    // cannnot move across drives and it we’re using parallels then they
    // _will_be_ separate drives
    tmpdir.join("prefix").cp({ to: dstdir });
    receipt.cp({ into: dstdir });
  } else {
    tmpdir.join("prefix").mv({ to: dstdir });
    receipt.mv({ into: dstdir });
  }
}

function platform() {
  const platform = (() => {
    switch (Deno.build.os) {
      case "darwin": return "Darwin";
      case "linux": return "Linux";
      case "windows": return "Windows";
    default:
      return Deno.build.os;
    }
  })()
  const arch = (() => {
    switch (Deno.build.arch) {
      case "x86_64": return "x86-64";
      case "aarch64": return "aarch64";
    }
  })()
  return [platform, arch];
}

import { SEPARATOR as SEP } from "jsr:@std/path@^1";

function platform_partial_path() {
  return platform().join(SEP);
}

function mktempd() {
  // if (Deno.build.os == "windows") {
  //   return new Path(Deno.makeTempDirSync({ dir: srcroot.join("tmp").mkdir().string }));
  // } else {
    return new Path(Deno.makeTempDirSync({ prefix: "pkgx." }));
  // }
}
