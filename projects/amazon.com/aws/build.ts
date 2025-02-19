import { BuildOptions, env_include, Path, run, unarchive, undent } from "brewkit";
import { walk } from "jsr:@std/fs@1/walk";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://github.com/aws/aws-cli/archive/${version}.tar.gz`);

  let symlink_python = "";
  if (Deno.build.os != "darwin") {
    env_include("llvm.org python~3.9");
    symlink_python = 'ln -sf "$(pkgx -q +python~3.9 -- which python)" "$d/python"';
  } else {
    // if Xcode or XCLT are installed, use that python
    symlink_python = undent`
      xc_python="$(xcode-select -p)"
      if [ "$xc_python" -a -f "$xc_python/usr/bin/python3" ]; then
        ln -sf "$xc_python/usr/bin/python3" "$d/python"
      else
        ln -sf "$(pkgx -q +python~3.9 -- which python)" "$d/python"
      fi`;
  }

  run`python3 -m venv ${prefix}`;
  run`${prefix}/bin/pip install --no-cache-dir .`;

  const content = Deno.readTextFileSync(`${prefix}/bin/aws`)
    .split("\n").slice(1) // drop shebang
    .join("\n");

  // this trickery is necessary to have python use the venv
  prefix.bin.rm("rf").mkdir().join("aws").write(undent`
    #!/bin/sh
    """:"
    d="$(cd "$(dirname "$0")" && pwd)"
    ${symlink_python}
    exec "$d/python" "$0" "$@"
    ":"""

    ${content}`).chmod(0o755);

  // reduce size as much as poss
  const rms = [];
  for await (const entry of walk(prefix.join("lib").string)) {
    if (entry.isDirectory && entry.name.endsWith(".dist-info")) {
      rms.push(entry.path);
    }
    if (entry.isFile && entry.name.endsWith(".h")) {
      Deno.removeSync(entry.path);
    }
    if (entry.isDirectory && entry.name == "tests") {
      rms.push(entry.path);
    }
    //FIXME the empty dir pruner should handle this but doesn’t
    if (entry.isDirectory && entry.name == "__pycache__") {
      rms.push(entry.path);
    }
  }

  // must do last or walk() throws
  for (const rm of rms) {
    new Path(rm).rm("rf");
  }

  prefix.join("lib/python3.9/site-packages/setuptools").rm("rf");
  prefix.join("lib/python3.9/site-packages/_distutils_hack").rm("rf");
  prefix.join("lib/python3.9/site-packages/pip").rm("rf");
  prefix.join("lib/python3.9/site-packages/pkg_resources").rm("rf");
}
