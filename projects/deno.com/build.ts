import { BuildOptions, env_include, inreplace, run, unarchive } from "brewkit";

//TODO for linux especially we want to build ourselves so we can use our own deps
// rather than have them statically compiled in

export default async function ({ prefix, tag }: BuildOptions) {
  try {
    await unarchive(`https://github.com/denoland/deno/releases/download/${tag}/deno-${Deno.build.target}.zip`);
    prefix.bin.install(Deno.build.os == "windows" ? "deno.exe" : "deno");
  } catch (e) {
    // nothing prebuilt
    await build({ prefix, tag });
  }
}

async function build({ prefix, tag }: Pick<BuildOptions, "prefix" | "tag">) {
  env_include("cargo");

  await unarchive(`https://github.com/denoland/deno/archive/refs/tags/${tag}.tar.gz`);

  Deno.env.set("CC", "clang");
  Deno.env.set("LD", "clang");
  Deno.env.set("AR", "llvm-ar");

  // install to ~/.local/bin and not ~/.deno/bin
  inreplace("cli/tools/installer.rs", 'home_path.push(".deno")', 'home_path.push(".local")');

  run`cargo -v install --locked --path cli --root=${prefix}`;
}
