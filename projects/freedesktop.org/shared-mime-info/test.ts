import { run } from "brewkit";

export default async function () {
  run`update-mime-database`;
//   test -f "{{prefix}}"/share/mime/packages/freedesktop.org.xml
//
}