import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="py-12 text-center">
      <p className="text-6xl font-bold tracking-tight text-slate-300 dark:text-slate-700">
        404
      </p>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Sayfa bulunamadı
      </h1>

      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.
      </p>

      <Link
        to="/"
        className="mt-8 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}

export default NotFoundPage;
