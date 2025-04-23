import { fixup, parse, Path, Prefix, SemVer, semver, set_active_pkg, walk_pkgx_dir } from "brewkit";

if (Deno.env.get("GITHUB_ACTIONS")) {
  console.log("::group::env");
  Object.entries(Deno.env.toObject()).forEach(([key, value]) => console.log(`${key}=${value}`));
  console.log("::endgroup::");
}

const pkg = parse(Deno.args[0]);
const build_dir = new Path(Deno.args[1]);
const props = new Path(Deno.args[2]);
const PKGX_DIR = new Path(Deno.args[3]);
const dstdir = new Path(Deno.args[4]);

Deno.chdir(build_dir.mkdir().string);

console.error("resolving...");

const got_versions: { version: SemVer }[] = await versions(pkg.constraint);
const version: { version: SemVer } = got_versions
  .filter(({ version }) => pkg.constraint.satisfies(version))
  .sort((a, b) => semver.compare(a.version, b.version))
  .pop()!;

const prefix = dstdir.join(pkg.project, `v${version.version}`);

console.error("%cresolved:", "color: yellow", `${pkg.project}=${version.version}`);

set_active_pkg({ project: pkg.project, version: version.version });

const SEP = Deno.build.os == "windows" ? ";" : ":";
let deps_prefixes = (Deno.env.get("PKGS") || "").split(SEP).compact(Path.abs);
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
  if (PKGX_DIR.isDirectory()) {
    // copy in deps (needed for the rpath fixer)
    for await (const {path: pkgdir, pkg: {project}} of walk_pkgx_dir(PKGX_DIR)) {
      if (project == pkg.project) continue; // it is common enough for a package to depend on itself
      const relpath = pkgdir.relative({ to: PKGX_DIR });
      pkgdir.mv({ into: dstdir.join(relpath).parent().mkdir('p') });
    }

    // ensure we continue to use pre-downloaded deps
    //NOTE cannot do this as it may mean we are trying to use what we just built during this step
    // Deno.env.set("PKGX_DIR", dstdir.string);

    deps_prefixes = deps_prefixes.map((prefix) => {
      const relpath = prefix.relative({ to: PKGX_DIR });
      return dstdir.join(relpath);
    });
  }

  await fixup(
    prefix,
    deps_prefixes,
    dstdir,
    PKGX_DIR,
    process_fixup,
  );
}
