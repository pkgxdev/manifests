import { fixture, run } from "brewkit";
import { assert } from "node:console";

export default async function () {
  run`cc test.c -lvorbisfile`;

  const proc = new Deno.Command("./a.out", { stdin: "piped" }).spawn();
  try {
    await Deno.openSync(fixture("ogg").string).readable.pipeTo(proc.stdin);
  } catch (err) {
    if (!(err instanceof Deno.errors.BrokenPipe)) throw err;
  }
  const { success } = await proc.status;
  assert(success, "ogg test failed");
}