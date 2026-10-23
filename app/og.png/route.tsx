import { ImageResponse } from "next/og";
import { site } from "@/lib/content";
import { loadFonts, OgCard, ogSize } from "@/lib/og";

export const dynamic = "force-static";

export async function GET() {
  const label = `${site.name} · Developer`;
  const body = site.tagline;

  return new ImageResponse(<OgCard big label={label} title={site.greeting} body={body} />, {
    ...ogSize,
    fonts: await loadFonts([
      { family: "DM Mono", weight: 400, text: label },
      { family: "Inter Tight", weight: 800, text: site.greeting },
      { family: "DM Sans", weight: 400, text: body },
    ]),
  });
}
