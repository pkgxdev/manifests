import { BuildOptions, env_include, inreplace, run, unarchive } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://cache.ruby-lang.org/pub/ruby/${version.marketing}/ruby-${version}.tar.gz`);

  if (Deno.build.os != 'windows') {
    env_include("rustc");

    run`./configure
          --prefix=${prefix}
          --disable-debug
          --enable-load-relative   # makes us relocatable
          --without-gmp
          --enable-shared
          --with-sitedir=/Library/Ruby/Site
          --with-vendordir=/Library/Ruby/Gems
          --disable-install-doc
          --disable-install-rdoc
          --disable-install-capi
          --disable-install-static-library
          --with-rubyarchprefix=${prefix}/lib/ruby   # no need for architecture specific crap
          --with-rubyhdrdir=${prefix}/include        # ^^
          --with-rubyarchhdrdir=${prefix}/include    # ^^
          --with-vendordir=no      # is empty so don’t pollute
          --with-vendorarchdir=no  # ^^
          --with-sitearchdir=no    # ^^
          --enable-yjit            # https://github.com/pkgxdev/pantry/issues/3538
          `;

    // prevent install failure due to no ability to create these dirs
    inreplace("./tool/rbinstall.rb", /prepare "extension scripts", (site|vendor)(arch)?libdir/g, "");

    run`make --jobs ${navigator.hardwareConcurrency} install`;
  } else {
    run`win32\configure.bat --prefix=${prefix} --with-ext=openssl`
    run`nmake`;
    run`nmake install`;
  }
}
