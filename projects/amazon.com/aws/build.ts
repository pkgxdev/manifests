import { BuildOptions, unarchive, venvify } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/aws/aws-cli/archive/${version}.tar.gz`);
  await venvify(prefix, "aws");
}
