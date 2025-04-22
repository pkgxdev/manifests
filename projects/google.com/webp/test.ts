import { fixture, run } from "brewkit";

export default async function () {
  run`img2webp ${fixture('jpeg')} -o out.webp`;
}
