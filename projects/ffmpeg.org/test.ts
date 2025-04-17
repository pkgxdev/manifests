import { run } from "brewkit";

export default async function () {
  const url = 'https://github.com/googlefonts/RobotoMono/raw/main/fonts/ttf/RobotoMono-Regular.ttf';
  run`pkgx curl -O ${url}`;
  run`ffmpeg
        -filter_complex
        testsrc=rate=1:duration=1,drawtext=fontfile=RobotoMono-Regular.ttf:text=hello
        out.mp4`;
}
