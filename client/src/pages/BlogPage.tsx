import { useState, useEffect, useMemo } from "react";
import { api } from "../services/api";
import Container from "../components/Container";
import PostCard from "../components/PostCard";
import EmptyState from "../components/EmptyState";
import { SkeletonList } from "../components/Skeleton";
import { DocumentIcon } from "../components/Icons";
import type { Post } from "../types/post";

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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

  // ARAMA ISTEMCI TARAFINDA.
  // Yazi sayisi birkac yuze cikana kadar bu dogru tercih: sunucuya
  // her tus vurusunda istek atmiyoruz, sonuc aninda geliyor.
  // Liste buyudugunde bu mantik backend'e (?q=) tasinmali.
  //
  // useMemo: her render'da yeniden filtrelemeyi onler. Burada liste
  // kucuk, ama kalip dogru: filtreleme girdilere BAGLI bir turetme.
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return posts;

    return posts.filter((post) =>
      // toLocaleLowerCase("tr"): "I" -> "ı", "İ" -> "i".
      // Varsayilan toLowerCase() Turkce'de yanlis sonuc verir,
      // "İstanbul" aramasi "istanbul" ile eslesmezdi.
      `${post.title} ${post.excerpt ?? ""} ${post.content}`
        .toLocaleLowerCase("tr")
        .includes(q),
    );
  }, [posts, query]);

  return (
    <Container>
      <header>
        <h1 className="page-title">Blog</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Öğrendiklerim, çözdüğüm problemler ve üzerinde çalıştığım konular.
        </p>
      </header>

      {/* Arama kutusu sadece aranacak kadar yazi varken gorunsun.
          Iki yazilik bir listenin ustunde arama kutusu, bos bir
          arayuz elemanindan baska bir sey degil. */}
      {!loading && !error && posts.length > 3 && (
        <div className="mt-8">
          <label htmlFor="ara" className="sr-only">
            Yazılarda ara
          </label>
          <input
            id="ara"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Yazılarda ara..."
            className="form-input !mt-0"
          />
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <SkeletonList count={3} />
        ) : error ? (
          <EmptyState
            tone="error"
            title={error}
            description="Sunucuya ulaşılamıyor olabilir. Birazdan tekrar dene."
            action={
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary"
              >
                Tekrar dene
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<DocumentIcon className="h-5 w-5" />}
            title={query ? "Sonuç bulunamadı" : "Henüz yazı yok"}
            description={
              query
                ? `"${query}" ile eşleşen bir yazı yok. Farklı bir kelime dene.`
                : "İlk yazı yolda. Bu arada projelere göz atabilirsin."
            }
            action={
              query ? (
                <button
                  onClick={() => setQuery("")}
                  className="btn-secondary"
                >
                  Aramayı temizle
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            {/* Kartin nasil gorundugunu bu dosya BILMIYOR. */}
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {query && (
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                {filtered.length} sonuç bulundu.
              </p>
            )}
          </>
        )}
      </div>
    </Container>
  );
}

export default BlogPage;
