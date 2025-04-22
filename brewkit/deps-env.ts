import { PackageRequirement, utils } from "https://raw.githubusercontent.com/pkgxdev/libpkgx/refs/tags/v0.21.0/mod.ts";
import { fromFileUrl } from "jsr:@std/path@1/from-file-url";
import * as yaml from "jsr:@std/yaml@^1/parse";

export default async function resolveDependencies(pkgspec: PackageRequirement, env: Record<string, string>) {
  const { deps } = get_data(pkgspec);
  return deps;
}

interface YAMLType {
  dependencies?: string | string[] | Record<string, string>;
  windows?: { dependencies?: string | string[] | Record<string, string> };
  darwin?: { dependencies?: string | string[] | Record<string, string> };
  linux?: { dependencies?: string | string[] | Record<string, string> };
}

function get_data(pkg: PackageRequirement) {
  const yamlfile = fromFileUrl(new URL(`../projects/${pkg.project}/package.yml`, import.meta.url));
  const obj = yaml.parse(Deno.readTextFileSync(yamlfile)) as YAMLType | undefined;
  const deps: PackageRequirement[] = [];
  const os = Deno.build.os as "windows" | "darwin" | "linux";

  deps.push(...parse_node(obj?.dependencies));
  deps.push(...parse_node(obj?.[os]?.dependencies));

  return { deps };
}

function parse_node(node: unknown) {
  if (typeof node === "string") {
    return node.split(/\s+/).map(utils.pkg.parse);
  } else if (Array.isArray(node)) {
    return node.map(utils.pkg.parse);
  } else if (node) {
    return Object.entries(node).map(([name, constraint]) => utils.pkg.parse(`${name}${constraint}`));
  } else {
    return [];
  }
}
