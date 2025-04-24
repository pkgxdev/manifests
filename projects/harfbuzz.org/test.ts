import { run } from "brewkit";
import { assert, assertEquals } from "jsr:@std/assert@1";

export default async function () {
  using f = await Deno.open('./test.ttf', { create: true, write: true });
  const rsp = await fetch('https://github.com/harfbuzz/harfbuzz/raw/refs/heads/main/test/shape/data/in-house/fonts/270b89df543a7e48e206a2d830c0e10e5265c630.ttf');
  await rsp.body!.pipeTo(f.writable);

  const proc = new Deno.Command("hb-shape", {args: ["./test.ttf"], stdin: "piped", stdout: "piped"}).spawn();
  const writer = proc.stdin.getWriter()
  writer.write(new TextEncoder().encode("സ്റ്റ്"));
  writer.close();
  assert((await proc.status).success);

  const { stdout } = await proc.output()
  assertEquals(new TextDecoder().decode(stdout).trim(), '[glyph201=0+1183|U0D4D=0+0]');
}