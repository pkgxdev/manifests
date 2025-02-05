#!/usr/bin/env -S pkgx deno^2.1 --allow-read --allow-write

import { parse, stringify } from "jsr:@std/yaml@^1";
import { dirname } from "jsr:@std/path@^1/dirname";
import { walk } from "jsr:@std/fs@^1/walk";

for await (const { name, path, isFile } of walk('./projects')) {
  if (isFile && name == 'package.yml') {
    const yaml = convert(path);
    const data = stringify(yaml);
    const outpath = `out/${path}`;
    Deno.mkdirSync(dirname(outpath), { recursive: true });
    Deno.writeTextFileSync(outpath, data);
  }
}

function convert(path: string) {
  const data = Deno.readTextFileSync(path)
  const yaml = parse(data) as any;
  const rv: Record<string, any> = {};
  if (yaml.name) rv['display-name'] = yaml.name;
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
    rv.companions = yaml.companions;
  }
  if (yaml.env) {
    rv.runtime = yaml.env;
  }
  if (yaml.programs) {
    rv.provides = yaml.programs;
  }

  /// pkgx^2 doesn’t support platform specific companions at this time
  if (yaml.linux?.companions) {
    rv.dependencies ??= {};
    rv.dependencies.linux = yaml.linux.companions;
  }
  if (yaml.darwin?.companions) {
    rv.dependencies ??= {};
    rv.dependencies.darwin = yaml.darwin.companions;
  }

  return rv;
}