import { assertEquals } from "jsr:@std/assert@^1/equals";

export default async function () {
  const proc = new Deno.Command("m4", { stdin: "piped", stdout: "piped" }).spawn();
  const stdin = proc.stdin.getWriter();
  stdin.write(new TextEncoder().encode(`define(TEST, pkgx.dev)TEST`));
  stdin.close();
  const stdout = new TextDecoder().decode((await proc.output()).stdout);
  assertEquals(stdout, "pkgx.dev");
}
