import { BuildOptions, inreplace, Path, run, unarchive } from "brewkit";

export default async function ({ prefix, tag, version, props }: BuildOptions) {
  if (Deno.build.os != "windows") {
    await unarchive(`https://mirrors.edge.kernel.org/pub/software/scm/git/git-${version}.tar.gz`);

    props.join("config.mak").cp({ into: Path.cwd() });

    run`./configure --prefix=${prefix}`;
    run`make install
          --jobs ${navigator.hardwareConcurrency}
          template_dir=share/git-core/templates
          NO_TCLTK=1
          INSTALL_STRIP=-s
          `;
    // ^^ setting `template_dir` is necessary or the resulting binary fails to be relocatable for eg. `git clone`
    run`make --directory contrib/subtree install`;

    Path.cwd().join("contrib/subtree/git-subtree").mv({
      into: prefix.join("bin"),
    });

    if (Deno.build.os == "darwin") {
      run`make --directory contrib/credential/osxkeychain`;

      Path.cwd().join("contrib/credential/osxkeychain/git-credential-osxkeychain")
        .mv({ into: prefix.join("bin") });

      inreplace(
        prefix.join("libexec/git-core/git-instaweb"),
        "#!/usr/bin/env python",
        "#!/usr/bin/python3",
      );
    }
  } else {
    await unarchive(`https://github.com/git-for-windows/git/archive/refs/tags/${tag}.zip`);

    Deno.chdir("contrib\\buildsystems");

    //TODO this uses vcpkg to install zlib, etc. which we don't want
    //NOTE cannot build in a separate directory or the install fails
    run`cmake
          -B ..\\..\\
          -S .
          -DCMAKE_INSTALL_PREFIX=${prefix}
          -DCMAKE_BUILD_TYPE=Release`;

    run`cmake --build ..\\..\\ --config Release --target install --parallel`;
  }
}
