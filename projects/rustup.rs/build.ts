import { BuildOptions, run, unarchive, undent } from "brewkit";

export default async function build({ prefix, version }: BuildOptions) {
  const ext = Deno.build.os === "windows" ? ".exe" : "";
  const rsp = await fetch(`https://static.rust-lang.org/rustup/archive/${version}/${Deno.build.target}/rustup-init${ext}`);
  const rustup_init = prefix.join("bin").mkdir('p').join(`rustup-init${ext}`);
  using file = await Deno.open(rustup_init.string, { write: true, create: true, truncate: true });
  await rsp.body!.pipeTo(file.writable);

  rustup_init.chmod(0o755);

  const tools = undent`
    rustc
    cargo
    cargo-clippy
    cargo-fmt
    clippy-driver
    rls
    rust-analyzer
    rust-gdb
    rust-gdbgui
    rust-lldb
    rustdoc
    rustfmt
    rustup
  `.split(/\s+/);

  for (const x of tools) {
    if (Deno.build.os != "windows") {
      prefix.bin.join(x).write(undent`
        #!/bin/sh

        if [ ! -f "$HOME/.cargo/env" ]; then
          # remove ourselves from PATH to prevent spurious warning from rustup-init
          D="$(dirname "$0")"
          SANITIZED_PATH=$(echo "$PATH" | awk -v RS=':' -v ORS=':' '$0 != "'"$D"'"' | sed 's/:$//')
          PATH="$SANITIZED_PATH" "$D/rustup-init" -y --no-modify-path
          if [ $? -ne 0 ]; then
            exit $?
          fi
        fi

        source ~/.cargo/env
        exec $(basename "$0") "$@"
        `).chmod(0o755);

    } else {
      throw new Error();
    }
  }
}