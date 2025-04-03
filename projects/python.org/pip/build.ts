import { BuildOptions, env_include, inreplace, Path, run, unarchive, undent } from "brewkit";

export default async function ({ prefix, tag, version }: BuildOptions) {
  await unarchive(`https://github.com/pypa/pip/archive/refs/tags/${tag}.tar.gz`);

  // have pip install things so that they work via pkgx
  inreplace(
    "src/pip/_internal/operations/install/wheel.py",
    /firstline = b.*/,
    'firstline = b"#!/usr/bin/env -S pkgx python~" + f"{sys.version_info.major}.{sys.version_info.minor}".encode("ascii") + b"\\n"',
  );

  const rsp = await fetch(`https://bootstrap.pypa.io/get-pip.py`);
  using file = await Deno.open("get-pip.py", { write: true, create: true });
  await rsp.body!.pipeTo(file.writable);

  env_include("python.org");

  run`python get-pip.py --target=bootstrap`;

  Deno.env.set("PYTHONPATH", Path.cwd().join("bootstrap").string);
  run`python -m pip install . --target=${prefix}`;

  prefix.join(`pip-${version}.dist-info`).rm("rf");

  // delete pip3, pip3.13 etc.
  for await (const [path, { name }] of prefix.bin.ls()) {
    if (name !== "pip") path.rm();
  }

  prefix.join("pip").mv({ into: prefix.join("lib/python").mkdir("p") });

  if (Deno.build.os != 'windows') {
    const pipfile = prefix.bin.join("pip");
    let contents = await prefix.bin.join("pip").read();
    contents = contents.split("\n").slice(1).join("\n");

    pipfile.write(undent`
      #!/bin/sh
      """:"
      d="$(cd "$(dirname "$0")/.." && pwd)"
      export PIP_DISABLE_PIP_VERSION_CHECK=1
      export PYTHONPATH="$d/lib/python\${PYTHONPATH:+:$PYTHONPATH}"
      exec python "$0" "$@"
      ":"""

      ${contents}`);
  } else {
    prefix.bin.join("pip.cmd").write(undent`
      @echo off
      setlocal
      set "d=%~dp0"
      if "%d:~-1%"=="\\" set "d=%d:~0,-1%"
      for %%i in ("%d%\\..") do set "d=%%~fi"

      set PIP_DISABLE_PIP_VERSION_CHECK=1

      if defined PYTHONPATH (
          set "PYTHONPATH=%d%\\lib\\python;%PYTHONPATH%"
      ) else (
          set "PYTHONPATH=%d%\\lib\\python"
      )

      python %~dp0/pip %*

      endlocal
      `);
  }
}
