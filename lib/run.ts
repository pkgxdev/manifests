function run_f(args: string[]) {
  if (args.length == 1) {
    args = args[0].trim().split(/\s+/);
  }
  const cmd = args.shift()!;

  console.error("%c+", "color:yellow", cmd, ...args);

  const { success, code } = new Deno.Command(cmd, {
    args,
    stdout: "inherit",
    stderr: "inherit",
  }).outputSync();

  if (!success) {
    console.error(`%c${cmd} error`, "color:red", `(${code})`);
    Deno.exit(code);
  }
}

export default function run(strings: TemplateStringsArray, ...values: any[]) {
  const s = String.raw(strings, ...values);
  const args = s.trim().split(/\s+/);
  return run_f(args);
}

export async function backticks(
  strings: TemplateStringsArray,
  ...values: any[]
) {
  const cmdln = String.raw(strings, ...values);
  const [cmd, ...args] = cmdln.trim().split(/\s+/);

  console.error("%c+", "color:yellow", cmd, ...args);

  const proc = new Deno.Command(cmd, { args, stdout: "piped" }).spawn();

  let rv = "";
  const decoder = new TextDecoder();
  for await (const chunk of proc.stdout) {
    const decoded_chunk = decoder.decode(chunk);
    console.log(decoded_chunk);
    rv += decoded_chunk;
  }

  const { success, code } = await proc.status;

  if (!success) {
    console.error(`%c${cmd} error`, "color:red", `(${code})`);
    Deno.exit(code);
  }

  return rv;
}
