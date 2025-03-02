import { run } from "brewkit";

export default function() {
  run`cc test.c -lgmp`;
  run`./a.out`;
}
