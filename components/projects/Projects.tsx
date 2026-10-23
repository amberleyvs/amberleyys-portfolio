import { ProjectCard } from "@/components/projects/ProjectCard";
import { ShowMore } from "@/components/ui/ShowMore";
import { projects } from "@/lib/content";
import styles from "./Projects.module.css";

const VISIBLE_PROJECTS = 3;

export function Projects() {
  return (
    <section id="projects" className="container" aria-labelledby="work-heading">
      <div className={`reveal ${styles.header}`}>
        <h2 id="work-heading" className={styles.heading}>
          Projects
        </h2>
      </div>

      <ShowMore total={projects.length} visible={VISIBLE_PROJECTS} controls="project-list">
        <ul id="project-list" role="list" className={`reveal-group ${styles.grid}`}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              extra={index >= VISIBLE_PROJECTS}
              firstExtra={index === VISIBLE_PROJECTS}
            />
          ))}
        </ul>
      </ShowMore>
    </section>
  );
}
