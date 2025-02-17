import { run } from "brewkit";

export default async function () {
  run`cmake --version`;
}
