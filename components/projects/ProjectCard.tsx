"use client";

import Image from "next/image";
import { useState } from "react";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { RepoLinks } from "@/components/projects/RepoLinks";
import { LoopingVideo } from "@/components/ui/LoopingVideo";
import { Placeholder } from "@/components/ui/Placeholder";
import type { Project } from "@/lib/content";
import styles from "./ProjectCard.module.css";

type Props = {
  project: Project;
  extra?: boolean;
  firstExtra?: boolean;
};

function Thumbnail({ project }: { project: Project }) {
  const first = project.media[0];
  if (!first) return <Placeholder className={styles.placeholder} label={`${project.title} screenshot or video`} />;

  if (first.type === "video") return <LoopingVideo className={styles.image} src={first.preview ?? first.src} poster={first.poster} />;
  return <Image className={styles.image} src={first.src} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 410px" />;
}

export function ProjectCard({ project, extra = false, firstExtra = false }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className={styles.card}
      data-extra={extra || undefined}
      data-first-extra={firstExtra || undefined}
      tabIndex={firstExtra ? -1 : undefined}
    >
      <div className={styles.thumb}>
        <Thumbnail project={project} />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <button type="button" className={styles.open} aria-haspopup="dialog" onClick={() => setOpen(true)}>
            {project.title}
          </button>
        </h3>
        <p className={styles.summary}>{project.summary}</p>
        <ul role="list" className="tags" aria-label="Tech stack">
          {project.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
        <RepoLinks project={project} className={styles.repos} />
      </div>

      <ProjectDialog project={project} open={open} onClose={() => setOpen(false)} />
    </li>
  );
}
