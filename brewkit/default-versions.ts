import { isNumber, isString } from "https://deno.land/x/is_what@v4.1.15/src/index.ts";
import { github, Range, SemVer } from "brewkit";
import { parse } from "jsr:@std/yaml@^1";

export default function (yamlfile: string) {
  const data = Deno.readTextFileSync(yamlfile);
  const yaml = parse(data) as any;
  if (Array.isArray(yaml.versions)) {
    return () =>
      yaml.versions.map((raw: string | number) => ({
        version: new SemVer(`${raw}`),
        tag: `${raw}`,
      }));
  }
  if (isString(yaml.version) || isNumber(yaml.version)) {
    const tag = `${yaml.version}`;
    return () => [{
      version: new SemVer(tag),
      tag,
    }];
  }
  if (yaml.repository) {
    const slug = new URL(yaml.repository).pathname.slice(1);
    return async (constraint: Range) => {
      return (await github.releases(slug, constraint)).compact(github.std_version_covert);
    };
  }
  throw new Error("you must write a `versions.ts` or provide a repository node in the `package.yml`");
}
