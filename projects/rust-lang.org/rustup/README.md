# rustup

We recommend invoking `rustup-init` with `--no-modify-path` and using `direnv`
to inject rust into your environment.

```sh
echo 'eval "$(pkgx --quiet direnv hook zsh)"' >> ~/.zshrc
```

Restart your terminal.

```sh
cd myproj.rs
echo 'source ~/.cargo/env' >> .envrc
pkgx direnv allow
```
