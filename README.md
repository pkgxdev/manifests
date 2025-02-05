# `pantry^2`

- Configuration is hardcoded to /etc
- We use prebuilt binaries where possible
  - Notably excepting when the prebuilt binaries vendor libraries we provide
- Windows support from day 1
- Relocatable without environment fixes for all base packages
- If we package a package manager and it provides a tool (in a unpainful way)
  then pkgx will invoke that other tool to get the thing
  - eg. `cargo-binstall`, `npx`, `uvx` etc. will be used instead of us packaging
    them
  - these other mechanisms are generally _preferred_ by the developer and
    end-user, we'll just know how to get you the end-product with a consistent
    CLI
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
- All packages designed to install into a shared prefix like `/usr/local`
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
- no support for dollar prefixed moustaches
- independently versioned things must be independent
  - generally we were good at this
- things without established versioning and/or programs are not valid to be
  packaged

## Why TypeScript?

`pantry^1` used YAML & mostly shell script to build and test. YAML just doesn’t
cut it, you end up putting constructs in place to facilitate logic and
complexity mounts and mounts. You may as well just use a real language.

Also we needed a cross platform language to support Windows. Bash is not that.

## Tasks

### docker

```sh
docker run  -it --rm -v $PWD:/work -w /work ghcr.io/pkgxdev/bldbot
```
