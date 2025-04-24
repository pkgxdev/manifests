import { run } from "brewkit";
import { assert } from "jsr:@std/assert@1/assert";

export default async function () {
  const proc = new Deno.Command("gperf", {stdin: "piped"}).spawn();
  const stdin = proc.stdin.getWriter();
  await stdin.write(new TextEncoder().encode("tea\nfoo\nbar"));
  stdin.close();
  assert((await proc.status).success);
}
