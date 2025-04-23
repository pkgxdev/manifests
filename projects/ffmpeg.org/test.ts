import { run } from "brewkit";

export default async function () {
  using f = await Deno.open('./test.ttf', { create: true, write: true });
  const rsp = await fetch('https://github.com/googlefonts/RobotoMono/raw/main/fonts/ttf/RobotoMono-Regular.ttf');
  await rsp.body!.pipeTo(f.writable);
  run`ffmpeg
        -filter_complex
        testsrc=rate=1:duration=1,drawtext=fontfile=test.ttf:text=hello
        out.mp4`;
}
