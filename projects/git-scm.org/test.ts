import { assert } from "jsr:@std/assert@^1";
import { run, test_utils } from "brewkit";
const { tmp, getstderr, asset_stdout } = test_utils;

export default async function () {
  await tmp(async () => {
    const stderr = await getstderr("git clone https://github.com/pkgxdev/pkgo");
    assert(!stderr.includes("warning: templates not found in"));
  });

  await tmp(async (cwd) => {
    cwd.join("testfile").touch();
    run`git init`;
    run`git add .`;
    asset_stdout("git diff --name-only --cached", "testfile");

    run`git config user.email me@example.com`;
    run`git config user.name MyName`;
    run`git config commit.gpgSign false`;
    run`git commit --message MyMessage`;

    run`git subtree add --prefix teaxyz-subtree https://github.com/pkgxdev/pkgo main --squash`;
  });
}
