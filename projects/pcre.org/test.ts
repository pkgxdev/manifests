import { run, TestOptions } from "brewkit";

export default async function ({ prefix }: TestOptions) {
  run`pcre2grep "regular expression" ${prefix}/share/man/man1/pcre2grep.1`;
}
