import { backticks_quiet, fixture, run, TestOptions } from "brewkit";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";

export default async function ({ version }: TestOptions) {
  // const vstr = `${version}`.replace(/\.(\d+)$/, ([,m]) => `-${m}`);
  // assertStringIncludes(backticks_quiet`magick -version`, vstr);

  // run`magick identify ${fixture('png')}`;

  // run`convert ${fixture('jpeg')} output.png`;

  // await fetch(
  //   'https://github.com/googlefonts/RobotoMono/raw/main/fonts/ttf/RobotoMono-Regular.ttf'
  // ).then(rsp =>
  //   rsp.body!.pipeTo(
  //     Deno.openSync('./test.ttf', { create: true, write: true }).writable
  //   )
  // );

  // run`convert
  //       -size 300x100
  //       xc:white
  //       -gravity center
  //       -font ./test.ttf
  //       -pointsize 20
  //       -annotate 0
  //       'Hello IM'
  //       text.png`;

  // run`composite -gravity center ${fixture('png')} ${fixture('jpeg')} out.png`;

  // run`convert ${fixture('jpeg')} -resize 100x100 -crop 50x50+10+10 +repage cropped.png`;

  // if (Deno.build.os == 'linux') {
  //   run`convert ${fixture('jpeg')} -liquid-rescale 80x80! warped.jpg`;
  // }

  // run`convert -delay 20 -loop 0 ${fixture('png')} ${fixture('png')} anim.gif`;

  run`pkgx +ruby@3 gem install rmagick`;
}
