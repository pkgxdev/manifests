import { run } from "brewkit";

export default async function () {
  //FIXME on linux should work but we need to add sqlite to the env first
  if (Deno.build.os == "darwin") {
    // Check if sqlite is ok, because we build with --enable-loadable-sqlite-extensions
    // and it can occur that building sqlite silently fails if OSX's sqlite is used.
    run`python -c "import sqlite3"`;
  }

  // check to see if we can create a venv
  // we can't ensurepip on 3.7 so, this won't work
  run`python -m venv myvenv`;

  // Check if some other modules import. Then the linked libs are working.
  run`python -c "import zlib"`;
  run`python -c "import pyexpat"`;
  run`python -v -c "import _ctypes"`;
}
