import { Link } from "react-router-dom";
import type { Post } from "../types/post";

function PostCard({ post }: { post: Post }) {
  return (
    // group: fare KARTIN uzerine geldiginde, ICINDEKI elemanlar
    // group-hover: ile tepki verebilir. Sadece baslik degil,
    // kartin herhangi bir yerine gelince baslik renk degistirir.
    <article className="group border-b border-slate-200 py-6 last:border-0 dark:border-slate-800">
      <Link to={`/blog/${post.slug}`} className="block">
        <h3 className="text-xl font-semibold tracking-tight transition group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {post.title}
        </h3>

        <time className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
          {new Date(post.createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>

        {/* line-clamp-2: metni 2 satirda keser, sonuna "..." koyar.
            Uzun ozetler kart yuksekligini bozmasin. */}
        <p className="mt-3 line-clamp-2 text-slate-600 dark:text-slate-300">
          {post.excerpt ?? post.content.slice(0, 200)}
        </p>
      </Link>
    </article>
  );
}

export default PostCard;
