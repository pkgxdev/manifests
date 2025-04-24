import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://bcrypt.sourceforge.net/bcrypt-${version.marketing}.tar.gz`);
  run`make LDFLAGS=-lz PREFIX=${prefix} install`;
}
