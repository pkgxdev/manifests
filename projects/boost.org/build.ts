import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version }: BuildOptions) {
  const tag = `${version}`.replaceAll(".", "_");
  await unarchive(`https://archives.boost.io/release/${version}/source/boost_${tag}.tar.gz`);
  run`./bootstrap.sh --prefix=${prefix}`;
  run`./b2 install --prefix=${prefix} ${args()}`;
}

function args() {
  switch (Deno.build.os) {
    case "darwin":
      return 'linkflags=-Wl,-headerpad_max_install_names';
    case "linux":
      return 'cxxflags=-fPIC linkflags=-fPIC';
    default:
      return '';
  }
}
