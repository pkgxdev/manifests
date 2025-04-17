import { run } from "brewkit";

export default async function () {
  run`yasm test.asm`;
}
