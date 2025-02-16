import { BuildOptions, run } from "brewkit";
import unarchive from "../../../brewkit/unarchive.ts";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/readline/readline-${tag}.tar.gz`);

  run`./configure --prefix=${prefix} --with-curses`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}
