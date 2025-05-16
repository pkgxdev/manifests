import { backticks, run, TestOptions } from "brewkit";
import { assertEquals } from "jsr:@std/assert@1/equals";
import { assertMatch } from "jsr:@std/assert@1/match";

export default async function ({ version }: TestOptions) {
  assertMatch(await backticks`terraform --version`, new RegExp(`^Terraform v${version}`));
  run`terraform init`;
  run`terraform apply --auto-approve`;
  const out = await backticks`terraform output fixture`;
  assertEquals(out, '"Hello, World!"');
}
