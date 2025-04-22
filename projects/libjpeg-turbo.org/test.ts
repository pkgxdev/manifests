import { run, fixture } from "brewkit";

export default function() {
  const jpeg = fixture('jpeg');
  run`jpegtran -crop 1x1 -transpose -perfect -outfile out.jpg ${jpeg}`;
  run`test -f out.jpg`;
}
