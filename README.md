# Workbench

The base setup every (macOS) developer needs.

Workbench is kinda a package manager. We install simple stubs that install
on-demand the tools you need. eg. `usr/local/bin/node` is just a shell script
that installs node to your home directory† and then invokes it.

Workbench can run any version of the tools we support. You can control this
via env:

```sh
$ WORKBENCH_NODE=^20 node --version
20.1.0
```

Or you can activate project directories and then we read the keyfiles in that
project to automatically determine versions:

```sh
$ cd my-project
$ cat package.json | jq -r '.engines.node'
20.1.0
$ node --version
22.10.0  # by default we run the latest version
$ workbench .
$ node --version
20.1.0  # now we run the version from the project
```

## What Tools Are Provided

We provide major language ecosystems and their essential companion tools and
that is it.

* `node`, `npm`, `npx`
  * `npm` and `npx` are just stubs to install `npm` and `npx` via `node`.
* `bun`
* `deno`
* `python`, `pip`
  * We also install versioned stubs (eg. `python3.9`)
  * `pip` is a proxy to install `pip` via python
* `uv`, `uvx`
  * `uvx` is—in our mind—essential for modern Python development.
* `rustc`, `cargo`, `rustup`
  * We *only* operate via `rustup` thus both `rustc` and `cargo` are
    in fact stubs that ensure `rustup` has configured a toolchain before
    proxying to the rustup installed tool. If `rustup` has not run we error.
* `ruby`
* `perl`
* `php`
* `go`
* `lua`, `luarocks`

For everything else use another package manager.

## Masterfully Packaged Tools

We only package a few things so we package them extremely well.

* Well configured out the box.
  * We use sane defaults like making `pip`, `npm` etc. install to your home
    directory.
  * We ensure packages look in `XDG` places for configuration files.
* Well optimized out the box.
  * We pour over the packages looking for every optimization we can apply.
  * We build separate package for all the CPU architectures we support to
    ensure the versions of key tools you are using are as fast as humanly
    possible.
* Max’d out
  * All features enabled
* Aware of macOS provided deps and not duping them
  * But also aware which ones are now too old and providing them as necessary.

> † `~/.local/pkgs` on *nix. \
> `%LOCALAPPDATA%\pkgs` on Windows.
