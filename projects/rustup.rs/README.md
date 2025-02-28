# rustup

We provide shims for all rust executables that initialize rustup (without
modifying your `.shellrc` files) and then re-exec the rustup installed tool
with the correct environment set.

This makes using rust via rustup as transparent as using rust itself.

## Use w/`direnv`

It is convenient to use `direnv` to activate your rustup environment but only
when inside rust projects.

```sh
cd myproj.rs
echo 'eval "$(pkgx --quiet direnv hook zsh)"' >> ~/.zshrc
echo 'source ~/.cargo/env' >> ./.envrc
# restart terminal
cd myproj.rs && pkgx direnv allow
```
