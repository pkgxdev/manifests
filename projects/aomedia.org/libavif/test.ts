import { fixture, run } from "brewkit";

export default async function () {
  run`avifenc ${fixture('png')} test.avif`;
  run`avifdec test.avif test.jpg`;
  run`cc test.c -lavif`;
  run`./a.out test.avif`;
}
