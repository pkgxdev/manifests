import { BuildOptions, env_include, run, SemVer, unarchive } from "brewkit";

export default async function ({ version, prefix, tag, props }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/tar/tar-${tag}.tar.gz`);

  massage({ version, props });

  run`./configure --prefix=${prefix} --with-curses`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;
}

function massage({ version, props }: any) {
  if (version.eq(new SemVer("1.35.0"))) {
    run`patch -p1 --input ${props}/iconv.patch`;
    env_include("automake~1.16");
  }
}
