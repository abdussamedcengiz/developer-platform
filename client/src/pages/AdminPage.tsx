import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import { SkeletonList } from "../components/Skeleton";
import { PlusIcon, DocumentIcon } from "../components/Icons";
import { formatDateShort } from "../utils/format";
import type { Post } from "../types/post";

function AdminPage() {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hangi yazinin silinmekte oldugunu tutuyoruz.
  // Tek bir boolean yetmezdi: hangi satirin butonunu
  // kilitleyecegimizi bilemezdik.
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await api.get<Post[]>("/api/posts");
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError("Yazılar yüklenemedi.");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  async function handleDelete(slug: string, title: string) {
    // Yikici islemler geri alinamaz -> once onay.
    if (!confirm(`"${title}" silinecek. Emin misin?`)) return;

    setDeletingSlug(slug);

    try {
      await api.delete(`/api/posts/${slug}`);

      // filter YENI bir dizi dondurur. splice ile yerinde
      // degistirseydik React degisikligi FARK ETMEZDI.
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error(err);
      alert("Yazı silinemedi.");
    } finally {
      setDeletingSlug(null);
    }
  }

  const published = posts.filter((p) => p.published).length;

  return (
    <Container>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Yazılar</h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {user?.email}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/projects" className="btn-secondary">
            Projeler
          </Link>
          <Link to="/admin/posts/new" className="btn-primary">
            <PlusIcon className="h-4 w-4" />
            Yeni Yazı
          </Link>
        </div>
      </div>

      {/* --- OZET ---
          Panele girer girmez "kac yazim var, kaci yayinda"
          sorusunun cevabi gorunsun. */}
      {!loading && !error && posts.length > 0 && (
        <dl className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: "Toplam", value: posts.length },
            { label: "Yayında", value: published },
            { label: "Taslak", value: posts.length - published },
          ].map((stat) => (
            <div key={stat.label} className="card px-4 py-3">
              <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {stat.label}
              </dt>
              <dd className="mt-1 font-mono text-2xl font-bold tracking-tight">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {error && (
        <p role="alert" className="alert-error mt-6">
          {error}
        </p>
      )}

      <div className="mt-8">
        {loading ? (
          <SkeletonList variant="row" count={4} />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={<DocumentIcon className="h-5 w-5" />}
            title="Henüz yazı yok"
            description="İlk yazını ekleyerek başla."
            action={
              <Link to="/admin/posts/new" className="btn-primary">
                <PlusIcon className="h-4 w-4" />
                Yeni Yazı
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {posts.map((post) => (
              <li
                key={post.id}
                className="group flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{post.title}</p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <span
                      className={
                        post.published ? "badge-emerald" : "badge-amber"
                      }
                    >
                      {post.published ? "Yayında" : "Taslak"}
                    </span>

                    <span className="font-mono text-xs">
                      {formatDateShort(post.createdAt)}
                    </span>

                    <span className="truncate font-mono text-xs text-slate-400 dark:text-slate-600">
                      /{post.slug}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {/* Yayindaki yazi icin "Gor" baglantisi: yazar
                      duzenledigi seyin okurdaki halini gorebilsin. */}
                  {post.published && (
                    <Link
                      to={`/blog/${post.slug}`}
                      className="btn-ghost !px-3 !py-1.5"
                    >
                      Gör
                    </Link>
                  )}

                  <Link
                    to={`/admin/posts/${post.slug}/edit`}
                    className="btn-ghost !px-3 !py-1.5"
                  >
                    Düzenle
                  </Link>

                  <button
                    onClick={() => handleDelete(post.slug, post.title)}
                    disabled={deletingSlug === post.slug}
                    className="btn-danger !px-3 !py-1.5"
                  >
                    {deletingSlug === post.slug ? "Siliniyor..." : "Sil"}
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

export default AdminPage;
