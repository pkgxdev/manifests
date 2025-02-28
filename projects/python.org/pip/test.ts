import { backticks, Path, run, TestOptions } from "brewkit";
import { assertMatch } from "jsr:@std/assert@^1/match";
import { assertPath } from "https://jsr.io/@std/path/1.0.8/_common/assert_path.ts";

export default async function ({ version, prefix }: TestOptions) {
  //TODO presumably needs encoding in the package.yml
  if (version.major < 19) {
    run`pkgx +python.org~3.9 pip install findtui --target .`;
  } else {
    run`pip install findtui --target foo`;
  }

  assertPath(Path.cwd().join("findtui/main.py").string);

  assertMatch(await backticks`pip --version`, new RegExp(prefix.string));
  assertMatch(await backticks`pip --version`, new RegExp(version.toString()));
}
