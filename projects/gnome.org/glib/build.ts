import { BuildOptions, unarchive, run, Path } from "brewkit";
import env_include from "../../../brewkit/env-include.ts";

export default async function ({ prefix, version, deps, tag, props }: BuildOptions) {
  await unarchive(`https://download.gnome.org/sources/glib/${version.major}.${version.minor}/glib-${version}.tar.xz`);

  env_include("mesonbuild.com");
  run`meson out
        --prefix=${prefix}
        --libdir=${prefix}/lib
        --wrap-mode=nofallback
        --buildtype=release
        -Dtests=false
      # -Dintrospection=enabled`;
  Path.cwd().join("out").cd();
  run`ninja install`;
//   - >-
//     GT='${prefix}/../../../gnu.org/gettext/v{{
//     deps.gnu.org/gettext.version.major }}'
//   - run: |
//       sed -i -e \
//         's|Libs: -L${libdir} -lglib-2.0 -lintl|Libs: -L${libdir} -lglib-2.0'\ -L$GT/lib\ -lintl\| \
//         ./glib-2.0.pc
//       sed -i -e \
//         's|Cflags: -I${includedir}/glib-2.0 -I${libdir}/glib-2.0/include|Cflags: -I${includedir}/glib-2.0 -I${libdir}/glib-2.0/include'\ -I$GT/include\| \
//         ./glib-2.0.pc
//     working-directory: '{{prefix}}/lib/pkgconfig'
//   - run: |
//       mv glib-{{version.major}}.0/* .
//       rmdir glib-{{version.major}}.0
//       ln -s . glib-{{version.major}}.0
//
//       mv gio-unix-{{version.major}}.0/gio/* gio/
//       rmdir -p gio-unix-{{version.major}}.0/gio
//       ln -s . gio-unix-{{version.major}}.0
//
//       ln -s ../lib/glib-{{version.major}}.0/include/* .
//     working-directory: '{{prefix}}/include'
//   - >-
//     cp -a ../venv/lib/python{{deps.python.org.version.marketing}}
//     "{{prefix}}"/lib
//   - run: >-
//       ln -s python{{deps.python.org.version.marketing}}
//       python{{deps.python.org.version.major}}
//     working-directory: '{{prefix}}/lib'
//   - run: >-
//       sed -i -e 's_{{deps.mesonbuild.com.prefix}}/venv/bin/python_/usr/bin/env
//       python_' gdbus-codegen glib-genmarshal glib-mkenums gtester-report
//     working-directory: '{{prefix}}/bin'
// env:
//   ARGS:
//     - '--prefix={{prefix}}'
//     - '--libdir={{prefix}}/lib'
//     - '--wrap-mode=nofallback'
//     - '--buildtype=release'
//     - '-Dtests=false'
//     - '-Dintrospection=enabled'
}