#!/usr/bin/env -S pkgx -q deno^2 --allow-read --allow-write

import { parse, stringify } from "jsr:@std/yaml@^1";

const yaml = convert(Deno.args[0]);
const data = stringify(yaml);
console.log(data);

function convert(path: string) {
  const data = Deno.readTextFileSync(path);
  const yaml = parse(data) as any;
  const rv: Record<string, any> = {};
  if (yaml.name) rv["display-name"] = yaml.name;
  if (yaml.dependencies) {
    rv.dependencies = yaml.dependencies;
  }
  if (yaml.linux?.dependencies) {
    rv.dependencies ??= {};
    rv.dependencies.linux = yaml.linux.dependencies;
  }
  if (yaml.darwin?.dependencies) {
    rv.dependencies ??= {};
    rv.dependencies.darwin = yaml.darwin.dependencies;
  }
  if (yaml.companions) {
    rv.companions = {};
    for (const project of yaml.companions) {
      rv.companions[project] = "*";
    }
  }
  if (yaml.linux?.companions) {
    rv.companions ??= {};
    rv.companions.linux = {};
    for (const companion of yaml.linux.companions) {
      rv.companions.linux[companion] = "*";
    }
  }
  if (yaml.darwin?.companions) {
    rv.companions ??= {};
    rv.companions.darwin = {};
    for (const companion of yaml.darwin.companions) {
      rv.companions.darwin[companion] = "*";
    }
  }
  if (yaml.env) {
    rv.runtime = { env: yaml.env };
  }
  if (yaml.programs) {
    rv.provides = yaml.programs;
  }

  return rv;
}
