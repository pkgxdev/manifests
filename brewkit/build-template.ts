import { fixup, parse, Path, SemVer, semver } from "brewkit";

const pkg = parse(Deno.args[0]);
const workdir = new Path(Deno.args[1]);
const props = new Path(Deno.args[2]);
const PKGX_DIR = new Path(Deno.args[3]);

console.error(
  "%cpkgspec:",
  "color: red",
  `${pkg.project}${pkg.constraint}`,
);
console.error("%cworkdir:", "color: red", workdir);

const got_versions: { version: SemVer }[] = await versions(pkg.constraint);
const version: { version: SemVer } = got_versions
  .filter(({ version }) => pkg.constraint.satisfies(version))
  .sort((a, b) => semver.compare(a.version, b.version))
  .pop()!;

console.error("%cversion:", "color: red", version.version);

const prefix = workdir.join(
  ".pkgx",
  pkg.project,
  `v${version.version}`,
);

if (Deno.env.get("GITHUB_ACTIONS")) {
  console.log("::group::build");
}

const deps_prefixes = (Deno.env.get("PKGS") || "").split(":").compact(Path.abs);
const deps = deps_prefixes.reduce((acc, prefix) => {
  const version = new SemVer(prefix.basename());
  const project = prefix.parent().relative({ to: PKGX_DIR });
  acc[project] = { version, prefix };
  return acc;
}, {} as Record<string, { version: SemVer; prefix: Path }>);

await build({ prefix, ...version, deps, props, PKGX_DIR });

if (Deno.env.get("GITHUB_ACTIONS")) {
  console.log("::endgroup::");
}

// needed for fix-machos and fix-elf
Deno.chdir(prefix.parent().string);
await Deno.symlink(prefix.basename(), `v${version.version.major}`);
Deno.chdir(workdir.string);

await fixup(
  prefix,
  { prefixes: deps_prefixes, PKGX_DIR },
  workdir.join(".pkgx"),
);

let platform_triple = Deno.build.target;
if (Deno.build.os == "linux") {
  platform_triple += "-gnu_2.28";
}

Deno.writeTextFileSync(
  workdir.join(".pkgx/build-receipt.json").string,
  JSON.stringify({
    version: `${version.version}`,
    project: pkg.project,
    platform_triple,
  }),
);
