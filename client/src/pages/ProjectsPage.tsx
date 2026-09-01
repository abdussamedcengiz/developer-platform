import { useEffect, useState } from "react";
import { api } from "../services/api";
import ProjectCard from "../components/ProjectCard";
import type { Project } from "../types/project";

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400">Yükleniyor...</p>;
  }

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Projeler</h1>

      {projects.length === 0 ? (
        <p className="mt-8 text-slate-500 dark:text-slate-400">
          Henüz proje eklenmedi.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
