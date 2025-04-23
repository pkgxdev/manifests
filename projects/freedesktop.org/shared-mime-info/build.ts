import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://gitlab.freedesktop.org/xdg/shared-mime-info/-/archive/${tag}/shared-mime-info-${tag}.tar.bz2`);

  run`meson setup bld --prefix=${prefix} --buildtype=release`;
  run`ninja -C bld install`;

  // freedesktop stuff searches XDG_DATA_DIRS/mime for mime info we set
  // XDG_DATA_HOME for all pacakges. Thus provided a consumer imports this
  // package they will get our pre-calculated mime database.
  run`${prefix}/bin/update-mime-database ${prefix}/share/mime`;
}
