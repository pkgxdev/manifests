import { github, Range, SemVer } from "brewkit";

export default async function(constraint: Range) {
  const releases = await github.releases("ImageMagick/ImageMagick", constraint);
  return releases.map(
    ({ tag_name: tag }) => {
      const s = tag.replace(/-(\d+)$/, ([,m]) => `.${m}`);
      const version = new SemVer(s);
      return { version, tag };
    },
  );
}
