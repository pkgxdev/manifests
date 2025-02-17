import { run } from "brewkit";

export default function () {
  Deno.writeTextFileSync("fixture.pl", "print 'Perl is not an acronym, but JAPH is a Perl acronym!'");
  run`perl ./fixture.pl`;
  run`shasum --version`;
}
