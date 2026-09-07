import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import Container from "../components/Container";
import Toggle from "../components/Toggle";
import { ArrowLeftIcon } from "../components/Icons";
import type { Project } from "../types/project";
import { slugify } from "../utils/slugify";
import FieldError from "../components/FieldError";
import { toFormErrors, NO_FORM_ERRORS } from "../utils/formErrors";

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
  // Alan bazinda hata gosterebilmek icin ozet + alanlar.
  const [errors, setErrors] = useState(NO_FORM_ERRORS);
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
        setErrors({ summary: "Proje yüklenemedi.", fields: {} });
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
    setErrors(NO_FORM_ERRORS);
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
      setErrors(toFormErrors(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Container>
        <div role="status" aria-label="Yükleniyor" className="animate-fade-in">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton mt-6 h-9 w-56" />
          <div className="skeleton mt-8 h-11 w-full" />
          <div className="skeleton mt-5 h-11 w-full" />
          <div className="skeleton mt-5 h-28 w-full" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Link
        to="/admin/projects"
        className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400"
      >
        <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Projelere dön
      </Link>

      <h1 className="mt-6 page-title">
        {isEditing ? "Projeyi Düzenle" : "Yeni Proje"}
      </h1>

      {errors.summary && (
        <p role="alert" className="alert-error mt-6">
          {errors.summary}
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
              placeholder="Projenin adı"
              className="form-input"
              // aria-invalid + aria-describedby: hatayi yalnizca
              // renkle degil, yardimci teknolojiyle de bildiriyoruz.
              aria-invalid={Boolean(errors.fields.title)}
              aria-describedby={errors.fields.title ? "title-error" : undefined}
            />
            <FieldError id="title-error" messages={errors.fields.title} />
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
              aria-invalid={Boolean(errors.fields.slug)}
              aria-describedby={errors.fields.slug ? "slug-error" : undefined}
            />
            <FieldError id="slug-error" messages={errors.fields.slug} />
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
              placeholder="Ne yaptığını ve hangi teknolojileri kullandığını bir iki cümleyle anlat."
              className="form-input"
              aria-invalid={Boolean(errors.fields.description)}
              aria-describedby={
                errors.fields.description ? "description-error" : undefined
              }
            />
            <FieldError
              id="description-error"
              messages={errors.fields.description}
            />
          </div>
        </div>

        {/* Uc opsiyonel adres tek kartta gruplandi: zorunlu alanlarla
            ayni yigin icinde olsalardi formun uzunlugu gozu korkuturdu. */}
        <div className="card space-y-5 p-6">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Bağlantılar
          </p>

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

            {/* Canli onizleme: yanlis yapistirilmis bir adresi
                kaydetmeden once gorursun. */}
            {imageUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <img
                  src={imageUrl}
                  alt="Görsel önizlemesi"
                  className="aspect-[16/9] w-full bg-slate-100 object-cover dark:bg-slate-800"
                  // Adres kirikse img etiketini gizle; kirik gorsel
                  // ikonu gostermek bilgi vermiyor, sadece cirkin.
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "";
                  }}
                />
              </div>
            )}
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
        </div>

        <Toggle
          id="featured"
          checked={featured}
          onChange={setFeatured}
          label="Öne çıkar"
          hint="Öne çıkan projeler ana sayfada gösterilir."
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

          <Link to="/admin/projects" className="btn-secondary">
            İptal
          </Link>
        </div>
      </form>
    </Container>
  );
}

export default ProjectFormPage;
