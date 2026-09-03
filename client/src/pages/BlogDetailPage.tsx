import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api, ApiError } from "../services/api";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import {
  ArrowLeftIcon,
  ClockIcon,
  LinkIcon,
  CheckIcon,
} from "../components/Icons";
import { formatDate, toISODate, readingTime } from "../utils/format";
import type { Post } from "../types/post";

function BlogDetailPage() {
  const { slug } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Yaris durumu korumasi: kullanici hizlica baska yaziya gecerse
    // bu istegin sonucunu state'e YAZMAYACAGIZ.
    let iptal = false;

    async function loadPost() {
      // slug degistiginde effect yeniden calisir; ekrani hazirla.
      setLoading(true);
      setError(null);

      try {
        const data = await api.get<Post>(`/api/posts/${slug}`);
        if (!iptal) setPost(data);
      } catch (err) {
        console.error(err);
        if (!iptal) {
          // ApiError status tasiyor -> 404 ile 500'u ayirt edebiliyoruz.
          if (err instanceof ApiError && err.status === 404) {
            setError("Böyle bir yazı bulunamadı.");
          } else {
            setError("Yazı yüklenirken bir sorun oluştu.");
          }
        }
      } finally {
        if (!iptal) setLoading(false);
      }
    }

    loadPost();

    // Temizleme: effect yeniden calismadan ONCE calisir.
    return () => {
      iptal = true;
    };
  }, [slug]);

  // BASLIK ETIKETI
  // Bu bir SPA: <title> sadece index.html'de bir kez ayarlanir.
  // Yazi sayfasinda sekme basligini guncellemek hem paylasilan
  // baglantida hem tarayici gecmisinde fark yaratir.
  useEffect(() => {
    if (!post) return;

    const previous = document.title;
    document.title = `${post.title} — Abdüssamed Cengiz`;

    // Sayfadan cikarken eski basligi geri koy.
    return () => {
      document.title = previous;
    };
  }, [post]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      // Geri bildirim kalici olmasin; 2 saniye sonra eski haline don.
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // clipboard API https disinda ya da izin verilmediginde calismaz.
      // Sessizce gecmek dogru: kullanici adres cubugundan kopyalayabilir.
      console.error(err);
    }
  }

  if (loading) {
    return (
      <Container>
        <div role="status" aria-label="Yükleniyor" className="animate-fade-in">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton mt-8 h-10 w-4/5" />
          <div className="skeleton mt-4 h-4 w-48" />

          <div className="mt-10 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="skeleton h-4"
                // Son satir kisa: gercek paragraflar da oyle biter.
                style={{ width: i % 4 === 3 ? "70%" : "100%" }}
              />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <EmptyState
          tone="error"
          title={error}
          description="Yazı silinmiş ya da adres yanlış yazılmış olabilir."
          action={
            <Link to="/blog" className="btn-secondary">
              <ArrowLeftIcon className="h-4 w-4" />
              Blog'a dön
            </Link>
          }
        />
      </Container>
    );
  }

  // TypeScript icin gerekli: post'un tipi hala "Post | null".
  if (!post) return null;

  return (
    <Container>
      <article className="animate-fade-up">
        <Link
          to="/blog"
          className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-accent-600 dark:text-slate-400 dark:hover:text-accent-400"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Blog'a dön
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8 dark:border-slate-800">
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <time dateTime={toISODate(post.createdAt)}>
              {formatDate(post.createdAt)}
            </time>

            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              {readingTime(post.content)} dk okuma
            </span>

            {!post.published && <span className="badge-amber">Taslak</span>}

            {/* Paylasim butonu sagda: icerikle yarismasin. */}
            <button
              type="button"
              onClick={copyLink}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4" />
                  Bağlantıyı kopyala
                </>
              )}
            </button>
          </div>
        </header>

        {/* whitespace-pre-line: metindeki satir sonlarini korur.
            HTML normalde ardisik bosluklari teke indirger. */}
        <div className="prose-body mt-10 whitespace-pre-line">
          {post.content}
        </div>

        <footer className="mt-14 border-t border-slate-200 pt-8 dark:border-slate-800">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 dark:text-accent-400"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Tüm yazılar
          </Link>
        </footer>
      </article>
    </Container>
  );
}

export default BlogDetailPage;
