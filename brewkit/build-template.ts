import { parse, Path, semver, SemVer } from "brewkit";
import fixup from "fixup";

const pkg = parse(Deno.args[0]);
const workdir = new Path(Deno.args[1]);
const props = new Path(Deno.args[2]);

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

await build({ prefix, ...version, props });

if (Deno.env.get("GITHUB_ACTIONS")) {
  console.log("::endgroup::");
}

// needed for fix-machos and fix-elf
Deno.chdir(prefix.parent().string);
await Deno.symlink(prefix.basename(), `v${version.version.major}`);
Deno.chdir(workdir.string);

const deps_prefixes = (Deno.env.get("PKGS") || '').split(':').filter(x => x).map(x => new Path(x));
await fixup(prefix, workdir.join(".pkgx"), deps_prefixes);

let platform_triple =
  `${Deno.build.arch}-${Deno.build.os}-${Deno.build.vendor}`;
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
