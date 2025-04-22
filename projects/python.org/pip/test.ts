import { backticks, Path, run, TestOptions } from "brewkit";
import { assertPath } from "https://jsr.io/@std/path/1.0.8/_common/assert_path.ts";
import { assertStringIncludes } from "jsr:@std/assert@1/string-includes";

export default async function ({ version, prefix }: TestOptions) {
  //TODO presumably needs encoding in the package.yml
  // tests pip install uses `--user` by default which is what our python is pkg’d to do
  if (version.major < 19) {
    run`pkgx +python.org~3.9 pip install findtui`;
  } else {
    run`pip install findtui`;
  }

  assertPath(Path.cwd().join("findtui/main.py").string);

  assertStringIncludes(await backticks`pip --version`, prefix.string);
  assertStringIncludes(await backticks`pip --version`, version.toString());
}
