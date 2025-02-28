# Ruby

The `pkgx` Ruby is built so it respects sane platform defaults, ie.

* The default site install on macOS is `/Library/Ruby/Site`, just like the
  Ruby bundled by Apple and `/usr/local/lib/ruby/site_ruby` on Linux.
* `gem` has been modified to automatically use `--user-install` unless the
  site directory is writable.
* `gem` has been modified so that binfiles install to sensible location, ie.
  `/usr/local/bin` or `~/.local/bin` depending on the gem install location.

In general we have gone to futher lengths to ensure relocatability. Hopefully
everything still works. Let us know if not.
