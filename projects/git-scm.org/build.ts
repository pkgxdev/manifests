import { BuildOptions, fix_shebang, Path, run, unarchive } from "brewkit";

export default async function ({ prefix, version, props }: BuildOptions) {
  await unarchive(`https://mirrors.edge.kernel.org/pub/software/scm/git/git-${version}.tar.xz`);

  Deno.env.set("INSTALL_STRIP", "-s");
  Deno.env.set("V", "1");

  props.join("config.mak").cp({ into: Path.cwd() });

  run`./configure --prefix=${prefix}`;
  run`make install
        --jobs ${navigator.hardwareConcurrency}
        template_dir=share/git-core/templates
        NO_TCLTK=1`;
  // ^^ setting `template_dir` is necessary or the resulting binary fails to be relocatable for eg. `git clone`
  run`make --directory contrib/subtree install`;

  Path.cwd().join("contrib/subtree/git-subtree").mv({
    into: prefix.join("bin"),
  });

  if (Deno.build.os == "darwin") {
    run`make --directory contrib/credential/osxkeychain`;
    Path.cwd().join("contrib/credential/osxkeychain/git-credential-osxkeychain")
      .mv({ into: prefix.join("bin") });
  }

  await fix_shebangs(prefix);
}

async function fix_shebangs(prefix: Path) {
  // no need to do this on macOS since all the shebangs are valid
  switch (Deno.build.os) {
    case "darwin":
      {
        const instawebPath = prefix.join("libexec/git-core/git-instaweb");
        let content = await prefix.join("libexec/git-core/git-instaweb").read();
        content = content.replaceAll(
          /^#!\/usr\/bin\/python/g,
          "#!/usr/bin/python3",
        );
        instawebPath.write({ text: content, force: true });
      }
      break;

    case "windows":
      break;

    default: {
      for await (const [path, { isFile }] of prefix.join("bin").ls()) {
        if (isFile) fix_shebang(path);
      }
      for await (
        const [path, { isFile }] of prefix.join("libexec/git-core").ls()
      ) {
        if (isFile) fix_shebang(path);
      }

      fix_shebang(prefix.join("share/gitweb/gitweb.cgi"));
      fix_shebang(
        prefix.join("share/git-core/templates/hooks/fsmonitor-watchman.sample"),
      );

      // prevent us needing a direct dependency on these packages
      // by using pkgx shebangs

      const instawebPath = prefix.join("libexec/git-core/git-instaweb");
      let content = await instawebPath.read();
      content = content.replaceAll(
        /^#!\/usr\/bin\/env (.+)/g,
        "#!/usr/bin/env -S pkgx $1",
      );
      content = content.replaceAll(
        /^#!\/usr\/bin\/perl/g,
        "#!/usr/bin/env -S pkgx perl",
      );
      instawebPath.write({ text: content, force: true });
    }
  }
}
