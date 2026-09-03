import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { MenuIcon, CloseIcon } from "./Icons";

const links = [
  { to: "/blog", label: "Blog" },
  { to: "/projects", label: "Projeler" },
  { to: "/about", label: "Hakkımda" },
];

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sayfa degisince menu KAPANMALI. Aksi halde kullanici bir baglantiya
  // basiyor, sayfa degisiyor ama menu ustte acik kaliyor.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Menu acikken arkadaki sayfanin kaymasini engelle.
  // Temizleme fonksiyonu sart: bilesen kaldirilirsa body kilitli kalmasin.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape ile kapatma: acilan her katmanin karsilamasi gereken
  // en temel klavye beklentisi.
  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Sayfa kaydirilinca basliga ince bir cerceve + golge ekliyoruz.
  // En ustteyken cerceve yok -> baslik sayfayla butunlesik gorunur.
  // passive: true -> tarayiciya "preventDefault cagirmayacagim" der,
  // kaydirma performansi icin onemli.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  // Masaustu baglanti stili. Aktif sayfa hem renk hem alt cizgiyle
  // isaretlenir -- rengi ayirt edemeyen kullanici icin ikinci ipucu.
  function deskLink({ isActive }: { isActive: boolean }) {
    return [
      "relative py-1 text-sm transition-colors",
      "after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:rounded-full after:bg-accent-500 after:transition-all",
      isActive
        ? "font-medium text-slate-900 after:w-full dark:text-slate-100"
        : "text-slate-600 after:w-0 hover:text-slate-900 hover:after:w-full dark:text-slate-400 dark:hover:text-slate-100",
    ].join(" ");
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85"
          : "border-b border-transparent bg-white/60 backdrop-blur-sm dark:bg-slate-950/60"
      }`}
    >
      <nav
        aria-label="Ana menü"
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6"
      >
        {/* --- SOL: isim + masaustu baglantilar --- */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5 font-semibold tracking-tight whitespace-nowrap"
          >
            {/* Monogram: profil fotografi olmadan da kimlik hissi verir
                ve navbar'a gorsel bir capa kazandirir. */}
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white transition group-hover:bg-accent-600 dark:bg-slate-100 dark:text-slate-900 dark:group-hover:bg-accent-500 dark:group-hover:text-white"
            >
              AC
            </span>

            {/* Kucuk ekranda kisa ad, sm ve ustunde tam ad.
                hidden / sm:inline ikilisi ayni bilgiyi iki bicimde sunar. */}
            <span className="transition group-hover:text-accent-600 dark:group-hover:text-accent-400">
              <span className="sm:hidden">A. Cengiz</span>
              <span className="hidden sm:inline">Abdüssamed Cengiz</span>
            </span>
          </Link>

          {/* Baglantilar mobilde gizlenir -> hamburger menuye tasinir.
              Onceden dar ekranda isim ve 3 baglanti ayni satira
              sikisiyor, dokunma hedefleri birbirine giriyordu. */}
          <div className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={deskLink}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* --- SAG: tema + oturum + hamburger --- */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          <div className="hidden items-center gap-1.5 md:flex">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-1.5 text-sm transition ${
                      isActive
                        ? "bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    }`
                  }
                >
                  Panel
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                Giriş
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            // aria-expanded: ekran okuyucuya menunun acik mi kapali mi
            // oldugunu soyler. aria-controls ise hangi bolumu actigini.
            aria-expanded={open}
            aria-controls="mobil-menu"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* --- MOBIL MENU ---
          Kapaliyken DOM'dan tamamen cikariyoruz (&&). Sadece gizlemek
          (hidden) yeterli olmazdi: gizli baglantilar hala klavyeyle
          odaklanabilir ve ekran okuyucuda okunabilirdi. */}
      {open && (
        <div
          id="mobil-menu"
          className="animate-fade-in border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="space-y-1 px-5 py-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 text-base transition ${
                    isActive
                      ? "bg-accent-50 font-medium text-accent-700 dark:bg-accent-500/10 dark:text-accent-300"
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="!mt-3 border-t border-slate-200 pt-3 dark:border-slate-800">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/admin"
                    className="block rounded-xl px-3 py-2.5 text-base text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Panel
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-xl px-3 py-2.5 text-left text-base text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Çıkış
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block rounded-xl px-3 py-2.5 text-base text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Giriş
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
