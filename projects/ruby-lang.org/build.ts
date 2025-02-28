import { BuildOptions, env_include, inreplace, insert, Path, run, unarchive, undent } from "brewkit";
import { expandGlob } from "jsr:@std/fs@1/expand-glob";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://cache.ruby-lang.org/pub/ruby/${version.marketing}/ruby-${version}.tar.gz`);

  if (Deno.build.os == "windows") {
    return build_windows(prefix);
  }

  // make `sudo gem install` put executables in `/usr/local/bin`
  change_ruby_function(
    "lib/rubygems/defaults.rb",
    "self.default_bindir",
    '    "/usr/local/bin"',
  );

  // make `gem install` put executables in `~/.local/bin`
  change_ruby_function(
    "lib/rubygems.rb",
    "self.bindir",
    `
    if install_dir.to_s == Gem.user_dir.to_s
      return File.join Gem.user_home, ".local", "bin"
    else
      Gem.default_bindir
    end`,
  );

  // make `gem install` always use an `env` shebang ∵ we are relocatable
  change_ruby_function(
    "lib/rubygems/defaults.rb",
    "self.operating_system_defaults",
    `
    {
      'install' => '--no-rdoc --no-ri --env-shebang',
      'update' => '--no-rdoc --no-ri --env-shebang'
    }`,
  );

  // the code in this function assumes that the system Gem.dir exists which we
  // cannot enforce because we are not that kind of package manager
  change_ruby_function(
    "lib/rubygems/defaults.rb",
    "self.default_user_install",
    '    !ENV.key?("GEM_HOME") && !File.writable?(File.dirname(Gem.dir))',
  );

  // ensure `gem` executables are invoked via `pkgx`
  inreplace(
    "lib/rubygems/installer.rb",
    '"#!#{@env_path} #{ruby_install_name}"',
    `"#!#{@env_path} -S pkgx ruby~${version.marketing}"`,
  );
  inreplace(
    "lib/rubygems/installer.rb",
    'exec "$ruby" "-x" "$0" "$@"',
    `exec pkgx ruby~${version.marketing} -x "$0" "$@"`,
  );

  // rust is needed to build the yjit features
  env_include("rust-lang.org");

  run`./configure
        --prefix=${prefix}
        --disable-debug
        --enable-load-relative   # makes us relocatable
        --without-gmp
        --enable-shared
        --with-sitedir=${sitedir()}
        --with-vendordir=${prefix}/lib/ruby  # have ruby treat its bundled gems as the “vendor” gems
        --disable-install-doc
        --disable-install-rdoc
        --disable-install-capi
        --disable-install-static-library
        --with-rubyarchprefix=${prefix}/lib/ruby   # no need for architecture specific crap
        --with-rubyhdrdir=${prefix}/include        # ^^
        --with-rubyarchhdrdir=${prefix}/include    # ^^
        --with-vendorarchdir=no  # ^^
        --with-sitearchdir=no    # ^^
        --sysconfdir=/etc
        --enable-yjit            # https://github.com/pkgxdev/pantry/issues/3538
        `;

  // prevent failure because make cannot create an empty “site” directory even
  // though it has no reason to be doing so
  inreplace("./tool/rbinstall.rb", /prepare "extension scripts", (site|vendor)(arch)?libdir/g, "");

  run`make --jobs ${navigator.hardwareConcurrency} install`;

  // fails build unless done after the build
  // need glob as this is an architecture dependent directory for fuck knows reasons
  for await (const { path } of expandGlob(`${prefix}/lib/ruby/${version.marketing}.0/*/rbconfig.rb`)) {
    // fixes native compilations and loadsa other things
    inreplace(
      path,
      prefix.string,
      "$(prefix)",
    );
  }

  // changes GEM_HOME default to the site directory
  // - prevents Ruby treating its install prefix as a place it can modify
  // - changes the default `sudo gem install` location to the site directory
  // - effects the gem path, we fix this by setting the vendor gems dir to the
  //   ruby-lib-prefix
  //NOTE this must happen post install or it affects `make install`
  change_ruby_function(
    `${prefix}/lib/ruby/${version.marketing}.0/rubygems/defaults.rb`,
    "self.default_dir",
    'RbConfig::CONFIG["sitelibdir"]',
  );
}

function build_windows(prefix: Path) {
  run`win32\\configure.bat --prefix=${prefix} --with-ext=openssl`;
  run`nmake`;
  run`nmake install`;
}

// only works if no other `end` is in the function
function change_ruby_function(file: string, function_name: string, body: string | ((foo: string) => string)) {
  console.error("%c+", "color: yellow", "inreplace", file);

  const lines = Deno.readTextFileSync(file).split("\n");
  const start = lines.findIndex((line) => new RegExp(`^\\s*def\\s+${function_name}`).test(line));

  if (start < 1) {
    throw new Error(`could not find function ${function_name} in ${file}`);
  }

  // look for the `end` that has the same amount of indentation as the `def`
  const defIndentation = lines[start].match(/^\s*/)![0].length;
  const end =
    lines.slice(start).findIndex((line) => line.trim() == "end" && line.match(/^\s*/)![0].length == defIndentation) +
    start;

  if (typeof body == "function") {
    body = body(lines.slice(start + 1, end).join("\n"));
  }

  lines.splice(start + 1, end - start - 1, body.replace(/^\n+/, ""));
  Deno.writeTextFileSync(file, lines.join("\n"));
}

function sitedir() {
  return Deno.build.os == "darwin" ? "/Library/Ruby/Site" : "/usr/local/lib/ruby/site";
}
