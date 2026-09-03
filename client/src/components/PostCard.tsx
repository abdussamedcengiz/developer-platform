import { Link } from "react-router-dom";
import type { Post } from "../types/post";
import { formatDate, toISODate, readingTime } from "../utils/format";
import { ArrowRightIcon } from "./Icons";

function PostCard({ post }: { post: Post }) {
  const excerpt = post.excerpt ?? post.content.slice(0, 200);

  return (
    // group: fare KARTIN uzerine geldiginde, ICINDEKI elemanlar
    // group-hover: ile tepki verebilir. Sadece baslik degil,
    // kartin herhangi bir yerine gelince baslik renk degistirir.
    <article className="group relative border-b border-slate-200 py-6 last:border-0 dark:border-slate-800">
      <Link to={`/blog/${post.slug}`} className="block">
        {/* Ust satir: tarih + okuma suresi.
            Basliktan ONCE geliyor cunku okuyucu once "bu ne kadar
            yeni ve ne kadar uzun" sorusuna bakiyor. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          {/* dateTime: makine okunur tarih. Ekranda Turkce bicimi
              gorunur, arama motoru ISO bicimi okur. */}
          <time dateTime={toISODate(post.createdAt)}>
            {formatDate(post.createdAt)}
          </time>

          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
            ·
          </span>

          <span>{readingTime(post.content)} dk okuma</span>

          {/* Taslaklar sadece yonetim panelinde gorunur ama yazar
              giris yapmisken listede de gorebiliyor -- isaretleyelim. */}
          {!post.published && <span className="badge-amber">Taslak</span>}
        </div>

        <h3 className="mt-2 text-xl font-semibold tracking-tight text-balance transition-colors group-hover:text-accent-600 dark:group-hover:text-accent-400">
          {post.title}
        </h3>

        {/* line-clamp-2: metni 2 satirda keser, sonuna "..." koyar.
            Uzun ozetler kart yuksekligini bozmasin. */}
        <p className="mt-2 line-clamp-2 text-slate-600 dark:text-slate-300">
          {excerpt}
        </p>

        {/* Okuma cagrisi. Fare ustune gelince ok saga kayiyor --
            baglantinin tiklanabilir oldugunu sezdiren kucuk bir isaret. */}
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 dark:text-accent-400">
          Yazıyı oku
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Link>
    </article>
  );
}

export default PostCard;
