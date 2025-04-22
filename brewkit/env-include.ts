import { backticks_quiet, parse, Path, undent } from "brewkit";
const SEP = Deno.build.os == "windows" ? ";" : ":";

export default function env_include(pkgspecs: string) {
  console.error("%c+", "color:yellow", "env", pkgspecs.split(/\s+/).map((x) => `+${x}`).join(" "));

  const args = pkgspecs.split(/\s+/).map((x) => `+${x}`).join(" ");
  const out = backticks_quiet`pkgx ${args} --json=v2`;
  const json = JSON.parse(out);

  for (
    const [key, values] of Object.entries(json.env as Record<string, string[]>)
  ) {
    const existing_value = Deno.env.get(key);
    const new_value = existing_value?.trim() ? `${values.join(SEP)}${SEP}${existing_value}` : values.join(SEP);
    Deno.env.set(key, new_value);
  }

  const rv: Record<string, string> = {};

  for (const [project, { runtime_env, path }] of Object.entries(json.pkgs as Record<string, { runtime_env?: Record<string, string>, path: string }>)) {
    for (const [key, value] of Object.entries(runtime_env ?? {})) {
      const old_value = Deno.env.get(key);
      let new_value = value.replace(`$${key}`, old_value?.trim() || "");
      new_value = new_value.replace(/:$/, '');
      Deno.env.set(key, new_value);
    }
    rv[project] = path;
  }

  return rv;
}

export function ensure(program: string) {
  if (Deno.build.os == "darwin" && program == "python") {
    program = "python3"; // use the provided python even though it's old(ish)
  }

  program = parse(program).project;
  if (!find_in_PATH(program)) {
    env_include(program);
  }
  // check it works
  backticks_quiet`${program} --version`;
}

export function find_in_PATH(program: string) {
  if (Deno.build.os == "windows") {
    program += ".exe";
  }
  const PATH = Deno.env.get("PATH")!.split(SEP);
  for (const dir of PATH) {
    const file = Path.abs(dir)?.join(program);
    if (file?.isExecutableFile()) {
      return file;
    }
  }
}

export function stub(pkgspecs: string | {pkgspec: string, program: string}) {
  const path = new Path(Deno.env.get("PKGX_BIN")!);
  if (typeof pkgspecs == 'string') {
    const args = pkgspecs.split(/\s+/);
    for (const arg of args) {
      const { project } = parse(arg);
      path.join(project).write(`#!/usr/bin/env -S pkgx -q! ${arg}\n`).chmod(0o755);
    }
  } else {
    path.join(pkgspecs.program).write(`#!/usr/bin/env -S pkgx -q! +${pkgspecs.pkgspec} -- ${pkgspecs.program}\n`).chmod(0o755);
  }
}
