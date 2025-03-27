import { Path } from "brewkit";

export default function (path: Path): boolean {
  // ldd fails with:
  // error while loading shared libraries: libLLVM.so.19.1-rust-1.85.1-stable: ELF load command address/offset not properly aligned
  // additional: in fact doing any patchelf stuff with this vendored rust breaks it
  // this means we do not fix rpaths to find out zlib, which is fine provided we are
  // run via pkgx
  return Deno.build.os != "linux";
}
