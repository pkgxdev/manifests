import { PackageRequirement, utils } from "https://raw.githubusercontent.com/pkgxdev/libpkgx/refs/tags/v0.21.0/mod.ts";
import { fromFileUrl } from "jsr:@std/path@1/from-file-url";
import * as yaml from "jsr:@std/yaml@^1/parse";

export default async function resolveDependencies(pkgspec: string) {

  const pkg = utils.pkg.parse(pkgspec);
  const { deps } = get_data(pkg);

  if (deps.length === 0) return;

  const plus = deps.map((dep) => {
    let str = utils.pkg.str(dep);
    if (str.endsWith("*")) str = str.slice(0, -1); // pkgx^2 bug
    return `+${str}`;
  });

  const proc = new Deno.Command("pkgx", {
    args: ["--json=v2", "--quiet", ...plus],
    stdout: "piped",
  }).spawn();

  const { success } = await proc.status;
  if (!success) {
    throw new Error("Fetching dependencies failed!");
  }

  const stdout = new TextDecoder().decode((await proc.output()).stdout);
  if (!stdout) return;
  return JSON.parse(stdout) as {
    env: Record<string, string[]>;
    pkgs: Record<string, {
      runtime_env: Record<string, string>;
      path: string;
      project: string;
      version: string;
      programs: string[];
    }>;
  }
}

function parseAndExportEnv(json: any) {
  for (const [key, paths] of Object.entries(json.env) as [string, string[]][]) {
    console.log(`export ${key}="${paths.join(":")}\${${key}:+:\$${key}}"`);
  }

  for (const [_pkg, env_dict] of Object.entries(json.runtime_env)) {
    for (let [key, value] of Object.entries(env_dict as any)) {
      const { path } = json.pkgs.find(({ project }: any) => project === _pkg);
      value = (value as string).replace("{{prefix}}", path);
      console.log(`export ${key}="${value}"`);
    }
  }

  const pkgs = Object.values(json.pkgs).map(({ path }: any) => path);
  console.log(`export PKGS=${pkgs.join(":")}`);
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
