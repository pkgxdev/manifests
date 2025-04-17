import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`http://www.lua.org/ftp/lua-${version}.tar.gz`);

  run`make macosx INSTALL_TOP=${prefix}`;
  run`make install INSTALL_TOP=${prefix}`;

  run`cc -o ${prefix.lib.join("liblua.dylib")} -shared ${objs()}`;

  prefix.lib.join("pkgconfig").mkdir().join("lua.pc").write(pc());

  function objs() {
    const txt = Path.cwd().join("src/Makefile").read();
    const core_o = txt.match(/^CORE_O=(.*)/m)![1]
    const lib_o = txt.match(/^LIB_O=(.*)/m)![1];
    return `${core_o} ${lib_o}`
      .split(/\s+/)
      .filter(x => x.trim())
      .map(o => Path.cwd().join('src', o).relative({ to: Path.cwd() }))
      .join(" ");
  }

  function pc() {
    let txt = props.join("lua.pc.in").read()
      .replaceAll("{{prefix}}", prefix.string)
      .replaceAll("{{version.marketing}}", version.marketing)
      .replaceAll("{{version}}", `${version}`)
    if (Deno.build.os === "linux") {
      txt = txt.replaceAll("-lm", "-lm -ldl");
    }
    return txt;
  }
}
