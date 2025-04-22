import { run } from "brewkit";

export default async function () {
  run`pango-view --version`;
}