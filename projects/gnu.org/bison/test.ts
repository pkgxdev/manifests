import { assertEquals } from "jsr:@std/assert@1/equals";
import { run } from "brewkit";

export default async function () {
  run`bison test.y`;

  {
    run`c++ test.tab.c`;

    const proc = new Deno.Command("./a.out", { stdin: "piped", stdout: "piped" }).spawn();
    const stdin = proc.stdin?.getWriter()
    await stdin.write(new TextEncoder().encode("((()(())))()\n"));
    stdin.close();
    const out = new TextDecoder().decode((await proc.output()).stdout);
    assertEquals(out, "pass");
  }
  {
    const proc = new Deno.Command("./a.out", { stdin: "piped", stdout: "piped" }).spawn();
    const stdin = proc.stdin?.getWriter()
    await stdin.write(new TextEncoder().encode("())\n"));
    stdin.close();
    const out = new TextDecoder().decode((await proc.output()).stdout);
    assertEquals(out, "fail");
  }
}
