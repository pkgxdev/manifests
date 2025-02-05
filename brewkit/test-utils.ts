import { assert } from "jsr:@std/assert@^1";
import { Path } from "brewkit";

export async function getstderr(cmdln: string) {
  const [cmd, ...args] = cmdln.split(/\s+/);
  const proc = new Deno.Command(cmd, { args, stderr: "piped" }).spawn();
  const out = await proc.output();
  return new TextDecoder().decode(out.stderr).trim();
}

export async function getstdout(cmdln: string) {
  const [cmd, ...args] = cmdln.split(/\s+/);
  const proc = new Deno.Command(cmd, { args, stdout: "piped" }).spawn();
  const out = await proc.output();
  return new TextDecoder().decode(out.stdout).trim();
}

export async function asset_stderr(cmdln: string, expected: string) {
  const stderr = await getstderr(cmdln);
  assert(stderr == expected, `stdout=\`${stderr}\`, expected=\`${expected}\``);
}

export async function asset_stdout(cmdln: string, expected: string) {
  const stdout = await getstdout(cmdln);
  assert(stdout == expected, `stdout=\`${stdout}\`, expected=\`${expected}\``);
}

export async function tmp<T>(fn: (d: Path) => Promise<T>): Promise<T> {
  //TODO actually base off of original CWD
  const tmp = Path.cwd().join(Math.random().toString(36).substring(2, 15))
    .mkdir();
  try {
    Deno.chdir(tmp.string);
    return await fn(tmp);
  } finally {
    Deno.chdir(tmp.parent().string);
    tmp.rm("rf");
  }
}
