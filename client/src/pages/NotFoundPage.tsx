import { Link } from "react-router-dom";
import Container from "../components/Container";
import { ArrowLeftIcon } from "../components/Icons";

const suggestions = [
  { to: "/projects", label: "Projeler" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "Hakkımda" },
];

function NotFoundPage() {
  return (
    <Container className="py-12 text-center">
      {/* Dev "404" rakami dekoratif; asil bilgi altindaki basliktta.
          Bu yuzden aria-hidden -- ekran okuyucu "dort yuz dort"
          diye okumasin. */}
      <p
        aria-hidden="true"
        className="bg-gradient-to-b from-slate-300 to-slate-100 bg-clip-text font-mono text-7xl font-bold tracking-tight text-transparent sm:text-8xl dark:from-slate-700 dark:to-slate-900"
      >
        404
      </p>

      <h1 className="mt-2 text-2xl font-bold tracking-tight">
        Sayfa bulunamadı
      </h1>

      <p className="mx-auto mt-3 max-w-sm text-slate-600 dark:text-slate-400">
        Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.
      </p>

      <div className="mt-8">
        <Link to="/" className="btn-primary px-5">
          <ArrowLeftIcon className="h-4 w-4" />
          Ana sayfaya dön
        </Link>
      </div>

      {/* Cikmaz sokakta birakmak yerine uc kapi acik birakiyoruz. */}
      <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Belki bunları arıyordun:
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {suggestions.map((item) => (
            <Link key={item.to} to={item.to} className="chip hover:underline">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default NotFoundPage;
