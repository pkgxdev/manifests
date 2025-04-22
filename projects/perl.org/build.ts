import { BuildOptions, inreplace, run, unarchive } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://www.cpan.org/src/${version.major}.0/perl-${version}.tar.gz`);

  if (Deno.build.os == "windows") {
    Deno.chdir("win32");
    run`nmake INST_TOP=${prefix} CCTYPE=MSVC143 install`;
    prefix.join("html").rm("rf");
  } else {
    const extra = Deno.build.os == "linux" ? "-Accflags=-fPIC" : "";

    run`./Configure
          -d
          -e
          -Dprefix=${prefix}
          -Duselargefiles
          -Dusethreads
          -Duseshrplib=false
          -Duserelocatableinc
          -DEBUGGING=none
          -Dsiteman1dir=/usr/local/share/man/man1
          -Dsiteman3dir=/usr/local/share/man/man3
          ${extra}`;

    run`make --jobs ${navigator.hardwareConcurrency} install`;

    const sitearchexp = await (async () => {
      for await (const [path, { name }] of prefix.lib.join(`${version}`).ls()) {
        if (name.includes("thread-multi")) {
          return path;
        }
      }
    })();

    const config_pm = sitearchexp!.join("Config.pm").chmod(0o644);

    // -Duserelocatableinc sets these to install site pkgs in the keg
    // but we don’t want that for site pkgs, we just want perl to be
    // able to find its system packages in a relocatable way
    inreplace(
      config_pm,
      /sitearchexp => .*/g,
      `sitearchexp => '${site_prefix()}/${sitearchexp!.basename()}',`,
    );
    inreplace(
      config_pm,
      /sitelibexp => .*/g,
      `sitelibexp => '${site_prefix()}/${version.marketing}',`,
    );
    inreplace(config_pm, /scriptdir => .*/g, "scriptdir => '/usr/local/bin',");

    //FIXME doesn’t work
    // cpan installs to ~/.local
    // inreplace(
    //   prefix.join(`lib/${version}/CPAN/FirstTime.pm`).chmod(0o644),
    //   "return File::Spec->catdir(_local_lib_home(), 'perl5');",
    //   "return File::Spec->catdir(_local_lib_home(), '.local')"
    // );

    //FIXME doesn’t work
    // inreplace(
    //   prefix.join("lib/5.40.1/CPAN/HandleConfig.pm").chmod(0o644),
    //   "my $dotcpan = $^O eq 'VMS' ? '_cpan' : '.cpan';",
    //   "my $dotcpan = $^O eq 'VMS' ? '_cpan' : '.local/share/cpan';",
    // )

    // tidy
    inreplace(config_pm, /libpth => .*/g, "libpth => '/usr/local/lib /usr/lib',");

    // rewrite hardcoded prefixes
    for await (const [path, { name }] of prefix.bin.ls()) {
      if (name == "perl" || name == `perl${version}`) continue;
      inreplace(path, `exec ${prefix.bin.join("perl")}`, "exec perl");
    }

    inreplace(prefix.bin.join("perlivp"), /^\s*my \$perlpath = .*;$/g, "my $perlpath = $^X;");
  }
}

function site_prefix() {
  switch (Deno.build.os) {
    case "darwin":
      return "/Library/Perl";
    case "linux":
      return `/usr/local/lib/perl`;
    default:
      throw new Error();
  }
}
