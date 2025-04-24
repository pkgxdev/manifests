import { nonce } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";
import { assertEquals } from "jsr:@std/assert@1/equals";

export default async function () {
  const nonced = nonce();
  Deno.writeTextFileSync("test.txt", nonced);

  {
    const proc = new Deno.Command("bcrypt", {args: ["-r", "./test.txt"], stdin: "piped"}).spawn();
    const stdin = proc.stdin.getWriter();
    stdin.write(new TextEncoder().encode("12345678\n12345678\n"));
    stdin.close();
    const { code } = await proc.status;
    assertEquals(code, 0);

    Deno.removeSync("test.txt");
  }

  const proc = new Deno.Command("bcrypt", {args: ["-r", "./test.txt.bfe"], stdin: "piped"}).spawn();
  const stdin = proc.stdin.getWriter();
  stdin.write(new TextEncoder().encode("12345678\n"));
  stdin.close();
  const { code } = await proc.status;
  assertEquals(code, 0);

  assertStringIncludes(Deno.readTextFileSync("test.txt"), nonced);
}
