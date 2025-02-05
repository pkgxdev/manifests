import { semver, SemVer, Path } from "brewkit";

export default async function* walk_pkgx_dir(root: Path) {
  if (!root.isDirectory()) return;
  const dirs = [root];
  let dir: Path | undefined;
  while ((dir = dirs.pop()) !== undefined) {
    for await (const [path, { name, isDirectory }] of dir.ls()) {
      if (!isDirectory) continue;
      if (semver.parse(name)) {
        const project = path.parent().relative({ to: root });
        const version = new SemVer(path.basename());
        yield { path, pkg: { project, version } };
      } else {
        dirs.push(path);
      }
    }
  }
}
