import { BuildOptions, unarchive, run, env_include } from "brewkit";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://github.com/libsdl-org/SDL/archive/refs/tags/release-${version}.tar.gz`);

  if (Deno.build.os === "linux") {
    env_include("x.org/protocol x.org/util-macros");
  }

  run`cmake
        -B bld
        -DCMAKE_INSTALL_PREFIX=${prefix}
        -Wno-dev
        -DSDL_INSTALL=ON
        -DSDL_HIDAPI=ON
        -DSDL_PULSEAUDIO=ON
        -DSDL_PULSEAUDIO_SHARED=ON
        -DSDL_DUMMYVIDEO=ON
        -DSDL_OPENGL=ON
        -DSDL_OPENGLES=ON
        -DSDL_X11=ON
        -DSDL_X11_XSCRNSAVER=ON
        -DSDL_X11_XCURSOR=ON
        -DSDL_X11_XINPUT=ON
        -DSDL_X11_XRANDR=ON
        -DSDL_X11_XSHAPE=ON
        -DSDL_X11_SHARED=ON`;
    run`cmake --build bld --target install`;
}
