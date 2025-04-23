import { fixture, run } from "brewkit";

// the below verifies a bunch of modules and features
// this is necessary since ffmpeg is not designed to be relocatable per-se

export default async function () {
  using f = await Deno.open('./test.ttf', { create: true, write: true });
  const rsp = await fetch('https://github.com/googlefonts/RobotoMono/raw/main/fonts/ttf/RobotoMono-Regular.ttf');
  await rsp.body!.pipeTo(f.writable);
  run`ffmpeg
        -filter_complex
        testsrc=rate=1:duration=1,drawtext=fontfile=test.ttf:text=hello
        out.mp4`;

  run`ffmpeg
        -f lavfi
        -i color=s=1280x720:d=5
        -vf subtitles=./test.ass
        -f null -`

  run`ffmpeg
        -f lavfi
        -i color=black:s=640x360:d=5
        -vf drawtext=fontfile=test.ttf:text='hello':fontsize=32:x=10:y=10
        -f null -`;

  run`ffmpeg
        -f lavfi
        -i sine=frequency=1000:duration=2
        -c:a
        libmp3lame
        ${fixture('mp3')}`;

  run`ffmpeg
        -f lavfi
        -i testsrc=duration=2:size=1280x720:rate=30
        -c:v
        libx264
        -f null -`;

  run`ffmpeg
        -f lavfi
        -i testsrc=duration=2:size=640x360:rate=30
        -c:v
        libvpx
        -f null -`;

  run`ffmpeg
        -f lavfi
        -i sine=frequency=500:duration=2
        -c:a
        libopus
        -f null -`
}
