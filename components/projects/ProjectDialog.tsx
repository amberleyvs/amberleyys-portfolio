"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { RepoLinks } from "@/components/projects/RepoLinks";
import { CloseIcon } from "@/components/ui/icons";
import { Placeholder } from "@/components/ui/Placeholder";
import type { Project } from "@/lib/content";
import styles from "./ProjectDialog.module.css";

type Props = {
  project: Project;
  open: boolean;
  onClose: () => void;
};

export function ProjectDialog({ project, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `project-${project.slug}-title`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const videos = Array.from(dialog.querySelectorAll("video"));

    if (open) {
      if (!dialog.open) {
        if (dialog.showModal) dialog.showModal();
        else dialog.setAttribute("open", "");
      }
      const [first] = videos;
      if (first) {
        first.muted = true;
        first.play?.()?.catch(() => {});
      }
      return;
    }

    for (const video of videos) {
      video.pause?.();
      video.currentTime = 0;
    }
    if (dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className={styles.type}>{project.type}</p>
            <h2 id={titleId} className={styles.title}>
              {project.title}
            </h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label={`Close ${project.title}`}>
            <CloseIcon size={22} />
          </button>
        </header>

        <div className={styles.media}>
          {project.media.length === 0 ? (
            <Placeholder
              className={styles.placeholder}
              label={`${project.title} screenshots or video`}
            />
          ) : (
            project.media.map((item) =>
              item.type === "video" ? (
                <video
                  key={item.src}
                  className={styles.video}
                  src={item.src}
                  poster={item.poster}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={item.alt}
                />
              ) : (
                <div key={item.src} className={styles.imageFrame}>
                  <Image className={styles.image} src={item.src} alt={item.alt} fill sizes="(max-width: 920px) 100vw, 880px" />
                </div>
              ),
            )
          )}
        </div>

        <div className={styles.details}>
          <p className={styles.description}>{project.description}</p>
          <dl className={styles.facts}>
            <div>
              <dt>Role</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>Tech Stack</dt>
              <dd>
                <ul role="list" className="tags">
                  {project.tags.map((tag) => (
                    <li key={tag} className="tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <RepoLinks project={project} />
        </div>
      </div>
    </dialog>
  );
}
