import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api, ApiError } from "../services/api";
import type { Project } from "../types/project";
import { slugify } from "../utils/slugify";

function ProjectFormPage() {
  const { slug: editingSlug } = useParams();
  const isEditing = Boolean(editingSlug);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [featured, setFeatured] = useState(false);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);

  useEffect(() => {
    if (!editingSlug) return;

    async function loadProject() {
      try {
        const project = await api.get<Project>(`/api/projects/${editingSlug}`);

        setTitle(project.title);
        setSlug(project.slug);
        setDescription(project.description);

        // DATABASE -> FORM: null gelebilir ama <input value={null}> olmaz.
        setImageUrl(project.imageUrl ?? "");
        setGithubUrl(project.githubUrl ?? "");
        setDemoUrl(project.demoUrl ?? "");

        setFeatured(project.featured);
      } catch (err) {
        console.error(err);
        setError("Proje yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [editingSlug]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManuallyEdited) setSlug(slugify(value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    // FORM -> DATABASE: bos string'i null'a cevir.
    // "||" kullaniyoruz, "??" degil -- "??" bos string'i yakalamaz.
    const body = {
      title,
      slug,
      description,
      imageUrl: imageUrl || null,
      githubUrl: githubUrl || null,
      demoUrl: demoUrl || null,
      featured,
    };

    try {
      if (isEditing) {
        await api.put(`/api/projects/${editingSlug}`, body);
      } else {
        await api.post("/api/projects", body);
      }

      navigate("/admin/projects");
    } catch (err) {
      console.error(err);

      if (err instanceof ApiError && err.status === 409) {
        setError("Bu slug zaten kullanılıyor. Farklı bir tane dene.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Kaydedilemedi.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400">Yükleniyor...</p>;
  }

  return (
    <div>
      <Link
        to="/admin/projects"
        className="text-sm text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
      >
        ← Projelere dön
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        {isEditing ? "Projeyi Düzenle" : "Yeni Proje"}
      </h1>

      {error && <p className="mt-6 alert-error">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="title" className="form-label">
            Başlık
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="slug" className="form-label">
            Slug
          </label>
          <input
            id="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManuallyEdited(true);
            }}
            className="form-input font-mono text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="form-label">
            Açıklama
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="form-label">
            Görsel adresi{" "}
            <span className="font-normal text-slate-400">(opsiyonel)</span>
          </label>
          {/* type="url": tarayici bicimi dogrular.
              Sunucu dogrulamasinin YERINE GECMEZ. */}
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="githubUrl" className="form-label">
            GitHub adresi{" "}
            <span className="font-normal text-slate-400">(opsiyonel)</span>
          </label>
          <input
            id="githubUrl"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="demoUrl" className="form-label">
            Canlı demo{" "}
            <span className="font-normal text-slate-400">(opsiyonel)</span>
          </label>
          <input
            id="demoUrl"
            type="url"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://..."
            className="form-input"
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <span className="text-sm">Öne çıkar</span>
        </label>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Oluştur"}
          </button>

          <Link to="/admin/projects" className="btn-secondary">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ProjectFormPage;
