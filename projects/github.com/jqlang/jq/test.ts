import { assertEquals } from "jsr:@std/assert@^1/equals";

export default async function () {
  const proc = new Deno.Command("jq", { args: [".devs[1].github"], stdin: "piped", stdout: "piped" }).spawn();
  const stdin = proc.stdin.getWriter();
  await stdin.write(new TextEncoder().encode(Deno.readTextFileSync("test.json")));
  stdin.close();
  const out = new TextDecoder().decode((await proc.output()).stdout);
  assertEquals(out, '"jhheider"\n');
}
