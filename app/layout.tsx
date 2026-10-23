import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { site } from "@/lib/content";
import { dmMono, dmSans, interTight } from "./fonts";
import "@/styles/tokens.css";
import "@/styles/global.css";

const title = `${site.name} · Developer`;
const images = [{ url: "/og.png", width: 1200, height: 630, type: "image/png", alt: `${site.greeting} ${site.tagline}` }];

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: "en_US", url: "/", title, description: site.description, images },
  twitter: { card: "summary_large_image", title, description: site.description, images },
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f5dc8c",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${dmSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
