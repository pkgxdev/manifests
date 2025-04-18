import { run } from "brewkit";

export default async function () {
  // dependencies:
//   curl.se: '*'
//   gnu.org/binutils: '*'
// script:
//   - curl -L $FONT > font.ttf
//   - out=$(echo 'സ്റ്റ്' | hb-shape font.ttf)
//   - test $out = "$OUT"
// env:
//   FONT: >-
//     https://github.com/harfbuzz/harfbuzz/raw/refs/tags/{{version.tag}}/test/shape/data/in-house/fonts/270b89df543a7e48e206a2d830c0e10e5265c630.ttf
//   OUT: '[glyph201=0+1183|U0D4D=0+0]'
// receipt: build/meson-logs/meson-log.txt
// 
}