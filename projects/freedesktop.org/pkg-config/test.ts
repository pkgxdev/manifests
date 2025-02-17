import { run } from "brewkit";

export default function () {
  run`pkg-config --version`;
}
