import { Path, run } from "brewkit";

export default async function (prefix: Path) {
  run`pkgx openssl x509 -noout -text -in ${prefix.join("share/ca-certs.pem")}`;
}
