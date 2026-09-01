import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api, ApiError } from "../services/api";
import type { Post } from "../types/post";

function BlogDetailPage() {
  const { slug } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400">Yükleniyor...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Link
          to="/blog"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Blog'a dön
        </Link>
      </div>
    );
  }

  // TypeScript icin gerekli: post'un tipi hala "Post | null".
  if (!post) return null;

  return (
    <article>
      <Link
        to="/blog"
        className="text-sm text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
      >
        ← Blog'a dön
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {post.title}
      </h1>

      <time className="mt-3 block text-sm text-slate-500 dark:text-slate-400">
        {new Date(post.createdAt).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </time>

      {/* whitespace-pre-line: metindeki satir sonlarini korur.
          HTML normalde ardisik bosluklari teke indirger. */}
      <div className="mt-8 leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">
        {post.content}
      </div>
    </article>
  );
}

export default BlogDetailPage;
