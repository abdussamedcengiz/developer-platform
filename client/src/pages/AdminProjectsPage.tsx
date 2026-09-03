import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import { SkeletonList } from "../components/Skeleton";
import { PlusIcon, ArrowLeftIcon, GitHubIcon } from "../components/Icons";
import { formatDateShort } from "../utils/format";
import type { Project } from "../types/project";

function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

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

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`"${title}" silinecek. Emin misin?`)) return;

    setDeletingSlug(slug);

    try {
      await api.delete(`/api/projects/${slug}`);
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error(err);
      alert("Proje silinemedi.");
    } finally {
      setDeletingSlug(null);
    }
  }

  return (
    <Container>
      <Link
        to="/admin"
        className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400"
      >
        <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Yazılara dön
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="page-title">Projeler</h1>

        <Link to="/admin/projects/new" className="btn-primary">
          <PlusIcon className="h-4 w-4" />
          Yeni Proje
        </Link>
      </div>

      {error && (
        <p role="alert" className="alert-error mt-6">
          {error}
        </p>
      )}

      <div className="mt-8">
        {loading ? (
          <SkeletonList variant="row" count={3} />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<GitHubIcon className="h-5 w-5" />}
            title="Henüz proje yok"
            description="İlk projeni ekleyerek başla."
            action={
              <Link to="/admin/projects/new" className="btn-primary">
                <PlusIcon className="h-4 w-4" />
                Yeni Proje
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{project.title}</p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    {project.featured && (
                      <span className="badge-amber">Öne çıkan</span>
                    )}

                    <span className="font-mono text-xs">
                      {formatDateShort(project.createdAt)}
                    </span>

                    <span className="truncate font-mono text-xs text-slate-400 dark:text-slate-600">
                      /{project.slug}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    to={`/admin/projects/${project.slug}/edit`}
                    className="btn-ghost !px-3 !py-1.5"
                  >
                    Düzenle
                  </Link>

                  <button
                    onClick={() => handleDelete(project.slug, project.title)}
                    disabled={deletingSlug === project.slug}
                    className="btn-danger !px-3 !py-1.5"
                  >
                    {deletingSlug === project.slug ? "Siliniyor..." : "Sil"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}

export default AdminProjectsPage;
