import { run } from "brewkit";

export default async function () {
  // env:
//   STRING: asdf123%!*
// script:
//   - test $(echo "$STRING" | zstd  | zstd -d) = "$STRING"
//   - test $(echo "$STRING" | pzstd | zstd -d) = "$STRING"
//   - test $(echo "$STRING" | xz    | zstd -d) = "$STRING"
//   - test $(echo "$STRING" | lz4   | zstd -d) = "$STRING"
//   - test $(echo "$STRING" | gzip  | zstd -d) = "$STRING"
// 
}