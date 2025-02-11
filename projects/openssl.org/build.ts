import { BuildOptions, run, unarchive } from "brewkit";

export default async function ({ prefix, tag }: BuildOptions) {
  await unarchive(`https://www.openssl.org/source/${tag}.tar.gz`);

  run`
    perl
    ./Configure
    --prefix=${prefix}
    no-tests
    enable-ec_nistp_64_gcc_128
    --openssldir=/etc/ssl
    `;
  // ^^ enable-ec_nistp_64_gcc_128 = supposedly important optimization
  run`make --jobs ${navigator.hardwareConcurrency}`;
  run`make install_sw`;

  // weird choices from openssl here
  prefix.join("lib64").isDirectory()?.mv({ to: prefix.join("lib") });
}
