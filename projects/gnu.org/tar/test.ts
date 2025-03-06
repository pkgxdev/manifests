import { run, TestOptions } from "brewkit";

export default function ({ prefix }: TestOptions) {
  run`tar czvf test.tar.gz ${prefix}`;
}
