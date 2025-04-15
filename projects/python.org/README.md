# Python

We have made `pip install foo` default to “user install” which was quite some
work.

It turns out `sudo pip install` does not work and is not intended to work.

Instead you should use `pipx` for this purpose. Even though `pipx` is not
really that good.

In general look for `pkgx` packaged python packages. Apparently.
