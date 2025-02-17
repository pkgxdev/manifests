import { BuildOptions, run } from "brewkit";
import unarchive from "../../../brewkit/unarchive.ts";

export default async function ({ prefix, version }: BuildOptions) {
  const M = version.major;
  const Mm = `${M}${version.minor}`;
  await unarchive(
    `https://cytranet.dl.sourceforge.net/project/infozip/UnZip ${version.major}.x (latest)/UnZip ${version.marketing}/unzip${version.major}${version.minor}.tar.gz`,
  );
  run`make --file unix/Makefile --jobs ${navigator.hardwareConcurrency} macosx`;
  run`make prefix=${prefix} install`;
}
