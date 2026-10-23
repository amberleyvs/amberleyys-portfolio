import type { Metadata } from "next";
import { About } from "@/components/about/About";
import { Experience } from "@/components/experience/Experience";
import { Hero } from "@/components/hero/Hero";
import { OffTheClock } from "@/components/off-the-clock/OffTheClock";
import { Projects } from "@/components/projects/Projects";
import { site } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  description: `${site.name} is a developer who builds clear, useful things for the web. Projects, experience, and life off the clock.`,
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <div id="work">
        <Experience />
        <Projects />
      </div>
      <OffTheClock />
    </>
  );
}
