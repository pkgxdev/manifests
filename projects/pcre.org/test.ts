import { run, TestOptions } from "brewkit";

export default async function ({ prefix, version }: TestOptions) {
  const v = version.major >= 10 ? "2" : "";
  run`pcre${v}grep "regular expression" ${prefix}/share/man/man1/pcre${v}grep.1`;

  if (version.major < 10) {
    run`c++ test.cc -lpcrecpp`
    run`./a.out`;
  }
}
