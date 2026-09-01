import type { Project } from "../types/project";

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold tracking-tight">{project.title}</h3>

        {project.featured && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
            Öne çıkan
          </span>
        )}
      </div>

      {/* flex-1: aciklama kalan alani doldurur, boylece baglantilar
          farkli uzunluktaki kartlarda AYNI hizada kalir. */}
      <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-300">
        {project.description}
      </p>

      {(project.githubUrl || project.demoUrl) && (
        <div className="mt-4 flex gap-4 text-sm">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 transition hover:underline dark:text-blue-400"
            >
              GitHub
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 transition hover:underline dark:text-blue-400"
            >
              Canlı Demo
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default ProjectCard;
