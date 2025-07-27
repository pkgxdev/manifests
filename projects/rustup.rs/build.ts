import { BuildOptions, undent } from "brewkit";

export default async function build({ prefix, version, props }: BuildOptions) {
  const ext = Deno.build.os === "windows" ? ".exe" : "";
  const rsp = await fetch(
    `https://static.rust-lang.org/rustup/archive/${version}/${Deno.build.target}/rustup-init${ext}`,
  );
  const rustup_init = prefix.join("bin").mkdir("p").join(`rustup-init${ext}`);
  using file = await Deno.open(rustup_init.string, { write: true, create: true, truncate: true });
  await rsp.body!.pipeTo(file.writable);

  rustup_init.chmod(0o755);
}
