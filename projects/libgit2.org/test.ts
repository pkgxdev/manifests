import { run } from "brewkit";

export default function() {
  run`cc test.c -lgit2`;
  run`./a.out`;
  run`git2 --version`;
}
