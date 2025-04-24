import { run, TestOptions } from "brewkit";

export default async function ({ version }: TestOptions) {
  run`cc test.c -lapr-${version.major}`;
  run`./a.out`;
}