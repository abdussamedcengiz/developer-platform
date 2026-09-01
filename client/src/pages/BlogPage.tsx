import { useState, useEffect } from "react";
import { api } from "../services/api";
import PostCard from "../components/PostCard";
import type { Post } from "../types/post";

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <p className="text-slate-500 dark:text-slate-400">Yükleniyor...</p>;
  }

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>

      {posts.length === 0 ? (
        <p className="mt-8 text-slate-500 dark:text-slate-400">
          Henüz yazı yok.
        </p>
      ) : (
        <div className="mt-4">
          {/* Kartin nasil gorundugunu bu dosya BILMIYOR. */}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogPage;
