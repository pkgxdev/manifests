import { BuildOptions, inreplace, run, stub, unarchive } from "brewkit";
import env_include from "../../brewkit/env-include.ts";

export default async function ({ prefix, version }: BuildOptions) {
  await unarchive(`https://cache.ruby-lang.org/pub/ruby/${version.marketing}/ruby-${version}.tar.gz`);

  env_include("rust");

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
}
