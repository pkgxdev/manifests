import Path from "../path.ts";

export async function fix_cmake_file(path: Path, install_prefix: Path) {
  // Facebook and others who use CMake sometimes rely on a libary's .cmake files
  // being shipped with it. This would be fine, except they have hardcoded paths.
  // But a simple solution has been found.
  const orig = await path.read();
  const relative_path = install_prefix.relative({ to: path.parent() });
  const text = orig.replaceAll(
    install_prefix.string,
    `\${CMAKE_CURRENT_LIST_DIR}/${relative_path}`,
  );
  if (orig !== text) {
    console.error("%c+", "color:yellow", "fixing:", path);
    path.write(text);
  }
}
