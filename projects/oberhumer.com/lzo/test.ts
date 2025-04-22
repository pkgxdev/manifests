import { run } from "brewkit";

export default async function () {
  run`cc test.c`;
  run`./a.out`;
//   test "$(./test)" = 'Testing LZO v{{ version.major }}.{{ version.minor }} in
//   tea.'
}