import { assertMatch } from "jsr:@std/assert@^1/match";
import { backticks, TestOptions } from "brewkit";

async function assertOutputMatch(cmd: string, regex: RegExp) {
  assertMatch(await backticks`${cmd}`, regex);
}

export default async function ({ version }: TestOptions) {
  await assertOutputMatch(
    "ncursesw6-config --version",
    new RegExp(`^${version.major}\.${version.minor}\.`),
  );

  // pkg-config --modversion ncursesw | grep {{version.marketing}}
  // pkg-config --libs ncursesw | grep '{{prefix}}'

  // https://github.com/pkgxdev/pantry/issues/1658
  // tmux -c ls
}
