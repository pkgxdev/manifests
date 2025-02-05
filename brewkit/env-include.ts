import { backticks_quiet, parse, Path, undent } from "brewkit";
const SEP = Deno.build.os == "windows" ? ";" : ":";

export default function env_include(pkgspecs: string) {
  const args = pkgspecs.split(/\s+/).map((x) => `+${x}`).join(" ");
  const out = backticks_quiet`pkgx ${args} --json=v1`;
  const json = JSON.parse(out);

  for (
    const [key, values] of Object.entries(json.env as Record<string, string[]>)
  ) {
    const existing_value = Deno.env.get(key);
    const new_value = existing_value?.trim() ? `${values.join(SEP)}${SEP}${existing_value}` : values.join(SEP);
    Deno.env.set(key, new_value);
  }
}

export function stub(pkgspecs: string) {
  const args = pkgspecs.split(/\s+/).map(parse);
  const path = new Path(Deno.env.get("PKGX_BIN")!);
  for (const arg of args) {
    let constraint = `${arg.constraint}`;
    if (constraint == "*") {
      constraint = "";
    }
    path.join(arg.project).write(undent`
      #!/bin/sh
      exec pkgx ${arg.project}${constraint} "$@"
      `).chmod(0o755);
  }
}
