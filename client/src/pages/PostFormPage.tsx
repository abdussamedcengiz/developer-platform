import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api, ApiError } from "../services/api";
import type { Post } from "../types/post";
import { slugify } from "../utils/slugify";

function PostFormPage() {
  // /admin/posts/new         -> slug undefined -> OLUSTURMA
  // /admin/posts/:slug/edit  -> slug dolu      -> DUZENLEME
  const { slug: editingSlug } = useParams();
  const isEditing = Boolean(editingSlug);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);

  useEffect(() => {
    if (!editingSlug) return;

    async function loadPost() {
      try {
        const post = await api.get<Post>(`/api/posts/${editingSlug}`);

        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt ?? "");
        setContent(post.content);
        setPublished(post.published);
      } catch (err) {
        console.error(err);
        setError("Yazı yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [editingSlug]);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body = { title, slug, excerpt: excerpt || null, content, published };

    try {
      if (isEditing) {
        await api.put(`/api/posts/${editingSlug}`, body);
      } else {
        await api.post("/api/posts", body);
      }

      navigate("/admin");
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
        to="/admin"
        className="text-sm text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
      >
        ← Panele dön
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        {isEditing ? "Yazıyı Düzenle" : "Yeni Yazı"}
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
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            /blog/{slug || "..."}
          </p>
        </div>

        <div>
          <label htmlFor="excerpt" className="form-label">
            Özet{" "}
            <span className="font-normal text-slate-400">(opsiyonel)</span>
          </label>
          <textarea
            id="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="content" className="form-label">
            İçerik
          </label>
          <textarea
            id="content"
            required
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Checkbox'ta value degil CHECKED kullanilir,
            ve okunacak alan e.target.checked'dir. */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <span className="text-sm">Yayınla</span>
        </label>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Oluştur"}
          </button>

          <Link to="/admin" className="btn-secondary">
            İptal
          </Link>
        </div>
      </form>
    </div>
  );
}

export default PostFormPage;
