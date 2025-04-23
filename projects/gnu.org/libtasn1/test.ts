import { run } from "brewkit";

export default async function () {
  run`asn1Coding pkix.asn assign.asn1`;
  run`asn1Decoding pkix.asn assign.out PKIX1.Dss-Sig-Value`;
}
