import experienceData from "@/content/experience.json";
import offTheClockData from "@/content/off-the-clock.json";
import projectsData from "@/content/projects.json";
import siteData from "@/content/site.json";
import trainData from "@/content/train.json";

type Site = {
  name: string;
  greeting: string;
  url: string;
  description: string;
  tagline: string;
  city: string;
  email: string;
  links: { linkedin: string; github: string; resume: string };
  photo: { src: string | null; alt: string; placeholder: string; caption: string };
  about: { paragraph: string; away: string };
  notFound: { image: string | null; alt: string };
};

export type TimelineEntry = {
  title: string;
  org: string;
  start: string;
  end: string | null;
  points: string[];
};

export type Experience = {
  roles: TimelineEntry[];
};

type Media =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; alt: string; poster?: string; preview?: string };

export type Project = {
  slug: string;
  title: string;
  type: string;
  summary: string;
  description: string;
  role: string;
  tags: string[];
  media: Media[];
  links: { label: string; url: string }[];
};

export type OffTheClockItem = {
  id: string;
  title: string;
  line: string;
  link?: { label: string; url: string };
  media: Media | null;
};

export type TrainSpot = { zone: "window"; window: number } | { zone: "roof" | "platform"; x: number };

type Train = {
  caption: string;
  cats: { name: string; file: string; start: TrainSpot }[];
};

export const site = siteData as Site;
export const experience = experienceData as Experience;
export const projects = projectsData as Project[];
export const offTheClock = offTheClockData as { intro: string; items: OffTheClockItem[] };
export const train = trainData as Train;
