import { assertEquals } from "jsr:@std/assert@1/equals";
import { assert } from "jsr:@std/assert@1/assert";

export default async function () {
  const proc = new Deno.Command("gawk", {
    args: ['{ gsub("Goodbye, cruel", "Hello,"); print }'],
    stdin: "piped", stdout: "piped"
  }).spawn();

  const stdin = proc.stdin.getWriter();
  const data = `Goodbye, cruel World\n`;
  stdin.write(new TextEncoder().encode(data));
  stdin.close();
  const { success } = await proc.status;
  assert(success);
  const { value } = await proc.stdout.getReader().read();
  const output = new TextDecoder().decode(value);
  assertEquals(output, "Hello, World\n");
}
