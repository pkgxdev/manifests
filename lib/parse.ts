import { PackageRequirement } from "./types.ts";
import { parseRange } from "jsr:@std/semver@^1";

export function parse(input: string): PackageRequirement {
  input = input.trim();

  const match = input.match(/^(.+?)([\^=~<>@].+)?$/);
  if (!match) throw new Error(`invalid pkgspec: ${input}`);
  if (!match[2]) match[2] = "*";

  const project = match[1];
  const constraint = parseRange(match[2]);
  return { project, constraint };
}
