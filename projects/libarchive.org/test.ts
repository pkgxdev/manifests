import { run, TestOptions } from "brewkit";

export default function ({ prefix }: TestOptions) {
  run`bsdtar -cf test.tar.gz ${prefix}`;
}
