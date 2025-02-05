import { compare, format, formatRange, satisfies } from "jsr:@std/semver@^1";
import { fixup, get_deps, parse, Path } from "brewkit";
import { arch } from "node:os";

const pkg = parse(Deno.args[0]);
const workdir = new Path(Deno.args[1]);
const props = new Path(Deno.args[2]);

console.error(
  "%cpkg:",
  "color: red",
  `${pkg.project}${formatRange(pkg.constraint)}`,
);
console.error("%cworkdir:", "color: red", workdir);
console.error("%cPATH:", "color: red", Deno.env.get("PATH"));

const version = (await versions(pkg.constraint))
  .filter((v) => satisfies(v, pkg.constraint))
  .sort((a, b) => compare(a.version, b.version))
  .pop();

console.error("%cversion:", "color: red", format(version.version));

const prefix = workdir.join(
  ".pkgx",
  pkg.project,
  `v${format(version.version)}`,
);

await build({ prefix, ...version, props });

// needed for fix-machos and fix-elf
Deno.chdir(prefix.parent().string);
await Deno.symlink(prefix.basename(), `v${version.version.major}`);
Deno.chdir(workdir.string);

await fixup(prefix, workdir.join(".pkgx"));

let platform_triple = `${Deno.build.arch}-${Deno.build.os}-${Deno.build.vendor}`
if (Deno.build.os == 'linux') {
  platform_triple += '-gnu_2.28'
}

Deno.writeTextFileSync(
  workdir.join(".pkgx/build-receipt.json").string,
  JSON.stringify({
    version: format(version.version),
    project: pkg.project,
    platform_triple,
  }),
);
