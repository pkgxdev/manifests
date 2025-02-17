import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://github.com/jqlang/jq/releases/download/${tag}/${tag}.tar.gz`);

  run`./configure
        --disable-maintainer-mode
        --prefix=${prefix}
        --disable-debug
        `;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;
}
