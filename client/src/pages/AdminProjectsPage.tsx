import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
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

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400">Yükleniyor...</p>;
  }

  return (
    <div>
      <Link
        to="/admin"
        className="text-sm text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
      >
        ← Yazılara dön
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Projeler</h1>

        <Link to="/admin/projects/new" className="btn-primary">
          Yeni Proje
        </Link>
      </div>

      {error && <p className="mt-6 alert-error">{error}</p>}

      {projects.length === 0 ? (
        <p className="mt-10 text-slate-500 dark:text-slate-400">
          Henüz proje yok.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-slate-200 dark:divide-slate-800">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <p className="font-medium">{project.title}</p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {project.featured && (
                    <span className="text-amber-600 dark:text-amber-400">
                      Öne çıkan ·{" "}
                    </span>
                  )}
                  {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Link
                  to={`/admin/projects/${project.slug}/edit`}
                  className="text-blue-600 transition hover:underline dark:text-blue-400"
                >
                  Düzenle
                </Link>

                <button
                  onClick={() => handleDelete(project.slug, project.title)}
                  disabled={deletingSlug === project.slug}
                  className="text-red-600 transition hover:underline disabled:opacity-50 dark:text-red-400"
                >
                  {deletingSlug === project.slug ? "Siliniyor..." : "Sil"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminProjectsPage;
