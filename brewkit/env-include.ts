import { backticks_quiet, parse, Path, undent } from "brewkit";
const SEP = Deno.build.os == "windows" ? ";" : ":";

export default function env_include(pkgspecs: string) {
  console.error("%c+", "color:yellow", "env", pkgspecs.split(/\s+/).map((x) => `+${x}`).join(" "));

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

export function ensure(program: string) {
  if (Deno.build.os == "darwin" && program == "python") {
    program = "python3"; // use the provided python even though it's old
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

export function stub(pkgspecs: string) {
  const args = pkgspecs.split(/\s+/);
  const path = new Path(Deno.env.get("PKGX_BIN")!);
  for (const arg of args) {
    const { project } = parse(arg);
    path.join(project).write(`#!/usr/bin/env -S pkgx -q! ${arg}\n`).chmod(0o755);
  }
}
