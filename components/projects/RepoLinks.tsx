import { GitHubIcon } from "@/components/ui/icons";
import type { Project } from "@/lib/content";
import styles from "./RepoLinks.module.css";

type Props = { project: Project; className?: string };

export function RepoLinks({ project, className }: Props) {
  return (
    <ul role="list" className={`${styles.links} ${className ?? ""}`}>
      {project.links.map((link) => {
        const host = link.url.includes("gitlab") ? "GitLab" : "GitHub";
        const name = link.label === host ? project.title : `${project.title} ${link.label}`;
        return (
          <li key={link.url}>
            <a
              className={styles.link}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on ${host} (opens in a new tab)`}
            >
              <GitHubIcon size={22} />
              {link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
