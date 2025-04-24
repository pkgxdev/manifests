import { BuildOptions, unarchive, run } from "brewkit";

export default async function ({ prefix, version, deps, tag }: BuildOptions) {
  await unarchive(`https://github.com/erlang/otp/releases/download/${tag}/otp_src_${version}.tar.gz`);

  let extra = Deno.build.os == 'darwin' ? `
    --enable-darwin-64bit
    --enable-kernel-poll
    --with-dynamic-trace=dtrace` : '';

  if (Deno.build.os == "linux") {
    // ld.lld: error: undefined reference: __extendhfsf2
    extra = "LDFLAGS=-Wl,--allow-shlib-undefined";
  }

  run`./configure
        --disable-debug
        --disable-silent-rules
        --prefix=${prefix}
        --enable-dynamic-ssl-lib
        --enable-hipe
        --enable-smp-support
        --enable-threads
        --enable-pie
        --with-ssl=${deps['openssl.org'].prefix}
        --without-javac
        ${extra}`;
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install`;
}