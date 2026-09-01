import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
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

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400">Yükleniyor...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Yazılar</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {user?.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/projects" className="btn-secondary">
            Projeler
          </Link>
          <Link to="/admin/posts/new" className="btn-primary">
            Yeni Yazı
          </Link>
        </div>
      </div>

      {error && <p className="mt-6 alert-error">{error}</p>}

      {posts.length === 0 ? (
        <p className="mt-10 text-slate-500 dark:text-slate-400">
          Henüz yazı yok.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-slate-200 dark:divide-slate-800">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  <span
                    className={
                      post.published
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  >
                    {post.published ? "Yayında" : "Taslak"}
                  </span>
                  {" · "}
                  {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <Link
                  to={`/admin/posts/${post.slug}/edit`}
                  className="text-blue-600 transition hover:underline dark:text-blue-400"
                >
                  Düzenle
                </Link>

                <button
                  onClick={() => handleDelete(post.slug, post.title)}
                  disabled={deletingSlug === post.slug}
                  className="text-red-600 transition hover:underline disabled:opacity-50 dark:text-red-400"
                >
                  {deletingSlug === post.slug ? "Siliniyor..." : "Sil"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPage;
