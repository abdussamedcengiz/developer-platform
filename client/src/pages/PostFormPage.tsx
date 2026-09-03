import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api, ApiError } from "../services/api";
import Container from "../components/Container";
import Toggle from "../components/Toggle";
import { ArrowLeftIcon } from "../components/Icons";
import { readingTime } from "../utils/format";
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
    return (
      <Container>
        <div role="status" aria-label="Yükleniyor" className="animate-fade-in">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton mt-6 h-9 w-56" />
          <div className="skeleton mt-8 h-11 w-full" />
          <div className="skeleton mt-5 h-11 w-full" />
          <div className="skeleton mt-5 h-60 w-full" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Link
        to="/admin"
        className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400"
      >
        <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Panele dön
      </Link>

      <h1 className="mt-6 page-title">
        {isEditing ? "Yazıyı Düzenle" : "Yeni Yazı"}
      </h1>

      {error && (
        <p role="alert" className="alert-error mt-6">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="card space-y-5 p-6">
          <div>
            <label htmlFor="title" className="form-label">
              Başlık
            </label>
            <input
              id="title"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Yazının başlığı"
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
            <p className="form-hint font-mono">/blog/{slug || "..."}</p>
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
              placeholder="Liste sayfasında görünecek kısa tanıtım."
              className="form-input"
            />
            <p className="form-hint">
              Boş bırakırsan içeriğin ilk 200 karakteri kullanılır.
            </p>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="content" className="form-label">
              İçerik
            </label>

            {/* Canli sayac: yazarken metnin ne kadar uzadigini gorursun.
                Kaydedip blog sayfasina gidip kontrol etmeye gerek kalmaz. */}
            {content.trim() && (
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                {content.trim().split(/\s+/).length} kelime ·{" "}
                {readingTime(content)} dk
              </span>
            )}
          </div>

          <textarea
            id="content"
            required
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-input font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Checkbox'ta value degil CHECKED kullanilir,
            ve okunacak alan e.target.checked'dir. */}
        <Toggle
          id="published"
          checked={published}
          onChange={setPublished}
          label="Yayınla"
          hint="Kapalıyken yazı taslak olarak kalır, sitede görünmez."
        />

        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
          <button type="submit" disabled={saving} className="btn-primary px-5">
            {saving ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
                Kaydediliyor...
              </>
            ) : isEditing ? (
              "Güncelle"
            ) : (
              "Oluştur"
            )}
          </button>

          <Link to="/admin" className="btn-secondary">
            İptal
          </Link>
        </div>
      </form>
    </Container>
  );
}

export default PostFormPage;
