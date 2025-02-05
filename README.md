# `pantry^2`

- Configuration is hardcoded to /etc
- We use vendor-built binaries where possible
  - We assume the vendor knows how to build their product better than us
  - Means issues are almost always upstream and not ours
  - Notably excepting when the prebuilt binaries vendor libraries we provide
- windows/x86-64 support from day 1
- Relocatable without environment fixes for all base packages
- If we package a package manager and it provides a tool (in a unpainful way)
  then pkgx will invoke that other tool to get the thing
  - eg. `cargo-binstall`, `npx`, `uvx` etc. will be used instead of us
    packaging them
  - these other mechanisms are generally _preferred_ by the developer and
    end-user, we'll just know how to get you the end-product with a consistent
    CLI
  - this means we can focus on ensuring the base is as good as possible
    without distraction from a massive pkg list
  - We will still index everything and show it at [pkgx.dev/pkgs]
- Minimizing deps on macOS
  - we added deps because Linux needed them in v1 due to laziness and urgency
- No magic
  - git no longer looks for `git-foo` if you type `git foo`
  - etc.
  - we would consider adding these back, but not as _part_ of the package
    itself. The package itself should solely focus on our other goals and
    otherwise be vanilla.
- `pkgx^1,^2` will use pantry^1, `pkgx^3` will use pantry^2
- building with as minimal images as is possible to ensure we are sure about
  what goes into our packages
- First class `pkgm` support
  - everything should install to `/usr/local` and just work
- No weird handling for calver
- no (or much less) pre-reqs on Linux
  - some deps are unavoidable since they are heavily customized for the system
    eg. librt
- variable deps
  - eg. a major version requires new deps
  - eg. heaven forbid, a minor version changes the dep constraint
- sources tarball locations can vary by version
- program lists can vary by version
- no deversioning of inner directories (for `pkgm`)
- no support for dollar prefixed moustaches in `package.yml`
- independently versioned things must be independent
  - generally we are already good at this
- things without established versioning and/or programs are not valid to be
  packaged. They go in `pkgo`
- standardize pkgs
  - use XDG and standard dirs on other platforms
  - configure things that install things to install them to
    `${INSTALL_ROOT:-$HOME/.local}` by default
- more consistent project names
  - no foo.github.io, just github.com etc.
  - no strict adherance to homepages, it's more about namespacing
- static linking libstdc++
  - gnu gcc libstdc++ is a an ABI bitch
  - so for now we statically link it
  - however we are uniquely positioned to handle this better TBH (TODO!)

[pkgx.dev/pkgs]: https://pkgx.dev/pkgs

## Usage

Assuming you are using `direnv` then:

```sh
$ direnv allow

$ pkg b python.org

$ pkg t python.org

$ pkg bt python.org
# ^^ build then test

$ ls bin
# ^^ see what else we provide
```

### Prerequisites

#### macOS

- Xcode Command Line Tools

### Windows

- Visual Studio Community Edition with C++
- We don’t provide a stub for `pkg` so invoke via `bin\\pkg-build foo`.
- You will need to use a developer prompt for some things.

### Linux

- libgcc and libstdc++ are still required at this time

## Wins

- Python from 280MB to 78MB
- Cleaner rpath handling across the board
- Less env pollution by carefully using `pkgx` during builds rather than
  importing dep-envs before builds, meaning more reliable builds with less
  unexpected deps
- Carefuly pruning of deps and build options for all base deps

### Build Infra Wins

- depennding on ourself now works without conflict since destination prefix
  is not within PKGX_DIR
- no more `+brewing`
- builds only occur in temporary directories meaning whatever happens builds
  are consistent
- Faster infra-bits in general

## FAQ

### Why TypeScript?

We prefer shell scripts for builds—there’s a lot of CLI commands and
manipulating paths, environment variables and doing pipes and things is way
easier there. But it’s not cross-platform and we wanted to support Windows.

`pantry^1` used YAML & mostly shell script to build and test. YAML just
doesn’t cut it, you end up putting constructs in place to facilitate logic and
complexity mounts and mounts. You may as well just use a real language.

Also we needed a cross platform language to support Windows. Bash is not that.

### Criteria for Inclusion

- We require that packages are versioned.
- We require that the project bew licensed such that we are permitted to
  redistribute it.
- Stuff that is so new that its build instructions are likely to change a lot
in future may be rejected due to our inability to reliably maintain that.
- Things that can have other general executors (eg. npx) should be run that
  way using the `providers` system.
- Things that do not respect reasonable release schedules may be rejected
  (eg. we have seen packages release 10+ times a day, every day).

### Requirements

For local builds we need some stuff set up:

* macOS
  * The Xcode Command Line Tools are expected to be installed
* Windows
  * Visual Studio Community Edition with C++
  * Some things expect `nmake` and thus you will need to run a
    “developer prompt”
* Linux
  * glibc libs and headers
  * stdc++

Mostly, otherwise we source build tools from `pkgx`.

### Boostrapping New Platforms

You will need preinstalled versions of the following:

- gcc
- make
- cmake
- bash
- glibc

Provided these are installed you should be able to build everything else in
commit order (use `pkg ls` to get the build order).

You’ll be able to build everything on the same machine, but as soon as you
want to use CI/CD you will need to upload bottles. Talk to us about how to do
that (our system is pretty simple and easy, but we haven’t documented it yet).
