# `pantry^2`

## Goals

- Better optimized packages
- Much more careful dependency selection
  - We have reviewed everything that is transitive thoroughly
- Leaner, more streamlined packages
  - Python reduced from 280MB to 78MB
  - LLVM pruned to just what is needed and split out into multiple packages
    reduing its size from 1.5GB to 300MB
- More consistent namespacing
- More reliable builds
- More robust bottles
  - eg. `rpath` fixes are now much more thorough and careful
- Better configured and more consistently configured packages
  - In general we set configuration to be `/etc` with user config carve outs
- Across the board dependency on OpenSSL^3 rather ^1.1.1
- Use of macOS system libraries where possible
- Windows native support
- Faster build infrastructure
- More minimal pre-requisite footprint on Linux
- 100% relocatable packages without environment fixes for all base packages
- Use vendor built binaries where possible and sensible
  - Provided the vendor does not statically link in libraries this is a
    better choice since we assume the vendor knows how to build their product
    better than us
- No magic
  - eg. `git` stub that looks to `pkgx` for `git-foo`
- More flexible build infrastructure
- Less unwise hacks
  - eg. symlinking versioned include directories, instead we now set `CPATH`
    in the package.yaml runtime env
  - Separating out eg. `gem` from Ruby for purity reasons was a mistake
- No more packaging for projects without versioning or with careless
  versioning. Eg. `llama.cpp` and `vim`.
  - Users still want these so we can instead make them build from source on
    demand.
  - It is gross currently since these projects release multiple times *a day*

## Future Goals

- First class `pkgm` support
  - everything should install to `/usr/local` and just work
- Zero pre-requisties on Linux
- Dependencies can vary by version
- Program lists can vary by version
- standardize pkgs
  - use XDG and standard dirs on other platforms
  - configure things that install things to install them to
    `${INSTALL_ROOT:-$HOME/.local}` by default

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
- `direnv` doesn’t work on Windows (what does?!) so you need to prefix
  everything with `bin\`
- You will need to use a developer prompt sometimes
  - really this is only to get `nmake` for packages that require that, for
    everything good that uses `cmake` you can use any command line engine.
  - we can probably work around this and find `nmake` ourselves

### Linux

- glibc, libgcc and their `-dev` pkgs are still required at this time

### Build Infra Wins

- a pkg depending on itself now works without conflict since destination
  prefix is not within PKGX_DIR
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

## Tasks

### docker-build

```sh
docker buildx build \
  --load \
  --tag ghcr.io/pkgxdev/bldbot:latest \
  --platform linux/amd64 \
  --progress=plain \
  --file .github/Dockerfile \
  .
```
