import { run } from "brewkit";

export default async function () {
  using f = await Deno.open('./test.ttf', { create: true, write: true });
  const rsp = await fetch('https://scripts.sil.org/pub/woff/fonts/Simple-Graphite-Font.ttf');
  await rsp.body!.pipeTo(f.writable);

  run`gr2fonttest ./test.ttf abcde`;
}