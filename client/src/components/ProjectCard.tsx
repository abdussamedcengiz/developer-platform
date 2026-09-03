import type { Project } from "../types/project";
import { GitHubIcon, ArrowUpRightIcon } from "./Icons";

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card-hover group flex flex-col overflow-hidden">
      {/* --- GORSEL ---
          imageUrl opsiyonel. Gorseli olmayan projede gorsel alani
          hic cizilmiyor; bos gri kutu birakmak kartin yarisini
          anlamsiz bosluga cevirirdi. */}
      {project.imageUrl && (
        <div className="aspect-[16/9] overflow-hidden border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
          <img
            src={project.imageUrl}
            alt={`${project.title} ekran görüntüsü`}
            // loading="lazy": ekranda gorunene kadar indirilmez.
            // Proje sayfasinda 10 gorsel varsa ilk yukleme cok daha hizli.
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold tracking-tight">{project.title}</h3>

          {project.featured && (
            <span className="badge-amber shrink-0">Öne çıkan</span>
          )}
        </div>

        {/* flex-1: aciklama kalan alani doldurur, boylece baglantilar
            farkli uzunluktaki kartlarda AYNI hizada kalir. */}
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {project.description}
        </p>

        {(project.githubUrl || project.demoUrl) && (
          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <GitHubIcon className="h-4 w-4" />
                Kaynak kod
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-medium text-accent-600 transition hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
              >
                Canlı demo
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
