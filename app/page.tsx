import type { Metadata } from "next";
import { About } from "@/components/about/About";
import { Experience } from "@/components/experience/Experience";
import { Hero } from "@/components/hero/Hero";
import { OffTheClock } from "@/components/off-the-clock/OffTheClock";
import { Projects } from "@/components/projects/Projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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
