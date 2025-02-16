import { Path, run, TestOptions } from "brewkit";

export default async function ({ prefix }: TestOptions) {
  run`pkgx openssl x509 -noout -text -in ${prefix.join("share/ca-certs.pem")}`;
}
