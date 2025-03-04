import { fixup, parse, Path, Prefix, SemVer, semver } from "brewkit";

const pkg = parse(Deno.args[0]);
const build_dir = new Path(Deno.args[1]);
const props = new Path(Deno.args[2]);
const PKGX_DIR = new Path(Deno.args[3]);
const prefix = new Path(Deno.args[4]);

Deno.chdir(build_dir.mkdir().string);

console.error(
  "%cpkgspec:",
  "color: red",
  `${pkg.project}${pkg.constraint}`,
);
console.error("%cstage:", "color: red", build_dir.parent());

const got_versions: { version: SemVer }[] = await versions(pkg.constraint);
const version: { version: SemVer } = got_versions
  .filter(({ version }) => pkg.constraint.satisfies(version))
  .sort((a, b) => semver.compare(a.version, b.version))
  .pop()!;

console.error("%cversion:", "color: red", version.version);

if (Deno.env.get("GITHUB_ACTIONS")) {
  console.log("::group::build");
}

const SEP = Deno.build.os == "windows" ? ";" : ":";
const deps_prefixes = (Deno.env.get("PKGS") || "").split(SEP).compact(Path.abs);
const deps = deps_prefixes.reduce((acc, prefix) => {
  const version = new SemVer(prefix.basename());
  const project = prefix.parent().relative({ to: PKGX_DIR });
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

if (Deno.env.get("GITHUB_ACTIONS")) {
  console.log("::endgroup::");
}

if (Deno.build.os != 'windows') {
  // rm -rf required since it is possible for a pkg to depend on itself
  const final_prefix = PKGX_DIR.join(pkg.project).mkdir("p").join(`v${version.version}`).rm("rf").ln("s", {
    target: prefix,
  });

  await fixup(
    prefix,
    final_prefix,
    deps_prefixes,
    PKGX_DIR,
    process_fixup,
  );
}
