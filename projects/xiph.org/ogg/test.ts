import { run } from "brewkit";
import { assert } from "jsr:@std/assert@1/assert";

export default async function () {
  run`cc test.c -logg`;

  const proc = new Deno.Command("./a.out", {stdin: "piped"}).spawn();
  const url = "https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg";
  const rsp = await fetch(url);

  const writer = proc.stdin.getWriter();
  const reader = rsp.body!.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      await writer.write(value);
    }
  } catch {
    reader.cancel();
    // program only reads 4096 bytes then quits so we will fail for sure
  }

  const { success } = await proc.status

  assert(success);
}