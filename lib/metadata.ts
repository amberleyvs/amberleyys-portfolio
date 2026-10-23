import type { Metadata } from "next";
import { site } from "@/lib/content";
import { ogSize } from "@/lib/og";

type PageMeta = {
  title?: string;
  description: string;
  path: string;
};

export function pageMetadata({ title, description, path }: PageMeta): Metadata {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name}, developer`;
  const images = [{ url: "/og.png", alt: `${site.name}: ${site.tagline}`, ...ogSize, type: "image/png" }];

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en",
      title: fullTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images,
    },
  };
}
