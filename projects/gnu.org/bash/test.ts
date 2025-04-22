import { run } from "brewkit";

export default async function () {
  run`bash -c "set -o pipefail"`;
}
