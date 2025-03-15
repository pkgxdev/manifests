import { BuildOptions, inreplace, insert, Path, run, unarchive, undent } from "brewkit";

export default async function ({ prefix, tag, deps }: BuildOptions) {
  await unarchive(`https://ftp.gnu.org/gnu/autoconf/autoconf-${tag}.tar.gz`);
  run`./configure
    --prefix=${prefix}
    --disable-debug`;
  run`make --jobs ${navigator.hardwareConcurrency} install`;

  for await (const [path] of prefix.bin.ls()) {
    await autofoo_fixes(path, prefix);
    inreplace(path, deps["gnu.org/m4"].prefix.join("bin/m4").string, "m4");
    if (deps["perl.org"]) {
      inreplace(path, deps["perl.org"].prefix.join("bin/perl").string, "perl");
    }
  }

  insert({
    after: `$ocache = "$cache/output.";\n`,
    line: "  @prepend_include = map { $_ =~ s/\\$PREFIX/$prefix/r } @prepend_include;",
    path: prefix.bin.join("autom4te"),
  });

  inreplace(prefix.share.join("autoconf/autom4te.cfg"), prefix.string, "$PREFIX");
}

export async function autofoo_fixes(path: Path, prefix: Path, do_begin = true) {
  inreplace(path, `'${prefix}`, "$prefix.'");
  if (do_begin) {
    insert({
      after: "BEGIN\n{\n",
      line: "  $prefix = dirname(dirname(abs_path(__FILE__)));\n",
      path,
    });
  }
  insert({
    after: "use warnings FATAL => 'all';\n",
    line: undent`
      use Cwd qw(abs_path);
      use File::Basename;

      my $prefix;`,
    path,
  });
}
