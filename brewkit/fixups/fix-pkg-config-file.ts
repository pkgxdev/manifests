import Path from "../path.ts";

export async function fix_pkg_config_file(path: Path, install_prefix: Path, PKGX_DIR: Path, og_PKGX_DIR: Path) {
  const orig = await path.read();
  const relative_path = install_prefix.relative({ to: path.parent() });
  const text = orig.replaceAll(
    install_prefix.string,
    `\${pcfiledir}/${relative_path}`,
  ).replaceAll(
    "/usr/local",  // we also sometimes pretend to install to /usr/local so that the package requires less fuckery, eg. python
    `\${pcfiledir}/${relative_path}`,
  ).replaceAll(
    og_PKGX_DIR.string,  // for dependency paths that leak into these pcfiles
    `\${prefix}/${PKGX_DIR.relative({ to: install_prefix })}`,
  );
  if (orig !== text) {
    console.log("%c+", "color:yellow", "fixing:", path);
    path.chmod(0o644).write(text);
  }
}
