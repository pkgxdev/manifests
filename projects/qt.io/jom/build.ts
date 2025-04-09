import { unarchive, BuildOptions } from "brewkit";

export default async function({ prefix, version }: BuildOptions) {
  const tag = version.toString().replace(".", "_");
  await unarchive(`https://mirrors.tuna.tsinghua.edu.cn/qt/official_releases/jom/jom_${tag}.zip`);
  prefix.bin.install("jom.exe");
}
