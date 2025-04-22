import { BuildOptions, unarchive, run, Path } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`http://www.lua.org/ftp/lua-${version}.tar.gz`);

  const platform = Deno.build.os === "darwin" ? "macosx" : 'linux-readline';
  const dl_extname = Deno.build.os === "darwin" ? "dylib" : "so";
  const MYLDFLAGS = Deno.build.os === 'linux' ? 'MYLDFLAGS=-ltinfo' : "";
  const MYCFLAGS = Deno.build.os === 'linux' ? 'MYCFLAGS=-fPIC' : "";

  run`make ${platform} INSTALL_TOP=${prefix} ${MYLDFLAGS} ${MYCFLAGS}`;
  run`make install INSTALL_TOP=${prefix}`;

  run`cc -o ${prefix.lib.join(`liblua.${dl_extname}`)} -shared ${objs()}`;

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
      txt = txt.replaceAll(" -lm", " -lm -ldl");
    }
    return txt;
  }
}
