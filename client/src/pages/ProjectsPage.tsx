import { useEffect, useState } from "react";
import { api } from "../services/api";
import Container from "../components/Container";
import ProjectCard from "../components/ProjectCard";
import EmptyState from "../components/EmptyState";
import { SkeletonList } from "../components/Skeleton";
import { GitHubIcon } from "../components/Icons";
import type { Project } from "../types/project";

type Filter = "all" | "featured";

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.get<Project[]>("/api/projects");
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError("Projeler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const featuredCount = projects.filter((p) => p.featured).length;
  const visible =
    filter === "featured" ? projects.filter((p) => p.featured) : projects;

  return (
    <Container size="lg">
      <header>
        <h1 className="page-title">Projeler</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Kendi yazdığım işler. Her birinde veritabanı şemasından arayüze kadar
          tüm katmanları kurdum; kaynak kodları GitHub'da açık.
        </p>
      </header>

      {/* FILTRE
          Sadece iki secenek var ve ikisi de anlamli sayida sonuc
          donduruyorsa gosteriyoruz. Tek projelik bir listede filtre
          bari, kullaniciya yapacak is uydurmaktir. */}
      {!loading && !error && featuredCount > 0 && projects.length > 2 && (
        <div
          role="group"
          aria-label="Proje filtresi"
          className="mt-8 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900/60"
        >
          {(
            [
              { key: "all", label: `Tümü (${projects.length})` },
              { key: "featured", label: `Öne çıkanlar (${featuredCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              // aria-pressed: bu bir acik/kapali durum butonu.
              // Ekran okuyucu hangisinin secili oldugunu boyle bilir.
              aria-pressed={filter === tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                filter === tab.key
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <SkeletonList variant="project" count={4} />
        ) : error ? (
          <EmptyState
            tone="error"
            title={error}
            description="Sunucuya ulaşılamıyor olabilir. Birazdan tekrar dene."
            action={
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                Tekrar dene
              </button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<GitHubIcon className="h-5 w-5" />}
            title="Henüz proje eklenmedi"
            description="Bu arada GitHub profilime göz atabilirsin."
            action={
              <a
                href="https://github.com/abdussamedcengiz"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                <GitHubIcon className="h-4 w-4" />
                GitHub profilim
              </a>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export default ProjectsPage;
