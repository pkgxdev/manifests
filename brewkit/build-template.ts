import { fixup, parse, Path, Prefix, SemVer, semver, set_active_pkg } from "brewkit";

const pkg = parse(Deno.args[0]);
const build_dir = new Path(Deno.args[1]);
const props = new Path(Deno.args[2]);
const PKGX_DIR = new Path(Deno.args[3]);
const dstdir = new Path(Deno.args[4]);

Deno.chdir(build_dir.mkdir().string);

console.error("%cstage:", "color: yellow", build_dir.parent());
console.error(
  "%cpkgspec:",
  "color: yellow",
  `${pkg.project}${pkg.constraint}`,
);

const got_versions: { version: SemVer }[] = await versions(pkg.constraint);
const version: { version: SemVer } = got_versions
  .filter(({ version }) => pkg.constraint.satisfies(version))
  .sort((a, b) => semver.compare(a.version, b.version))
  .pop()!;

const prefix = dstdir.join(pkg.project, `v${version.version}`);

console.error("%cresolved:", "color: yellow", `${pkg.project}=${version.version}`);

set_active_pkg({ project: pkg.project, version: version.version });

const SEP = Deno.build.os == "windows" ? ";" : ":";
const deps_prefixes = (Deno.env.get("PKGS") || "").split(SEP).compact(Path.abs);
const deps = deps_prefixes.reduce((acc, prefix) => {
  const version = new SemVer(prefix.basename());
  const project = prefix.parent().relative({ to: PKGX_DIR }).replaceAll("\\", "/");
  acc[project] = { version, prefix };
  return acc;
}, {} as Record<string, { version: SemVer; prefix: Path }>);

const opts = {
  prefix: new Prefix(prefix),
  ...(() => {
    const v: SemVer & { marketing: string } = version.version as any;
    v.marketing = `${v.major}.${v.minor}`;
    return {
      ...version,
      version: v,
    };
  })(),
  deps,
  props,
  PKGX_DIR,
};

await build(opts);

let platform_triple = Deno.build.target;
if (Deno.build.os == "linux") {
  platform_triple += "-gnu_2.28";
}

Deno.writeTextFileSync(
  build_dir.parent().join("build-receipt.json").string,
  JSON.stringify(
    {
      project: pkg.project,
      version: `${version.version}`,
      target: platform_triple,
      prefix: prefix.string,
      deps: deps_prefixes,
      PKGX_DIR: PKGX_DIR.string,
    },
    null,
    2,
  ),
);

if (Deno.build.os != "windows") {
  // use pre-downloaded pkgs on Linux especially
  Deno.env.delete("PKGX_DIR");

  if (PKGX_DIR.isDirectory()) {
    // it is common enough for a package to depend on itself
    PKGX_DIR.join(pkg.project).rm("rf");

    // copy in deps, needed for the rpath fixer
    PKGX_DIR.cp({ into: dstdir });
  }

  await fixup(
    prefix,
    deps_prefixes,
    dstdir,
    process_fixup,
  );
}
