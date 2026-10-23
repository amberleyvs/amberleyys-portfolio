import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

describe("pageMetadata", () => {
  it("sets the canonical path and the default preview image", () => {
    const meta = pageMetadata({ title: "About", description: "About me.", path: "/about" });
    expect(meta.title).toBe("About");
    expect(meta.alternates?.canonical).toBe("/about");
    expect(meta.openGraph).toMatchObject({
      title: `About · ${site.name}`,
      url: "/about",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("leaves the title to the layout default on Home", () => {
    const meta = pageMetadata({ description: "Home.", path: "/" });
    expect(meta.title).toBeUndefined();
    expect(meta.openGraph?.title).toBe(`${site.name}, developer`);
  });
});
