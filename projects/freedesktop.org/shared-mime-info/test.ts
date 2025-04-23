import { run, TestOptions } from "brewkit";
import { assert } from "jsr:@std/assert@1/assert";

export default async function ({ prefix }: TestOptions) {
  run`update-mime-database -h`;
  assert(prefix.join("/share/mime/packages/freedesktop.org.xml"));
}