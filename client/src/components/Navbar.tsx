import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const links = [
  { to: "/blog", label: "Blog" },
  { to: "/projects", label: "Projeler" },
  { to: "/about", label: "Hakkımda" },
];

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    // sticky top-0 z-50 -> sayfa kayarken ustte kalir
    // backdrop-blur      -> arkasindaki icerik bulaniklasir (cam etkisi)
    // /80                -> arka plan rengi %80 opaklikta
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        {/* Sol: isim + baglantilar */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="font-semibold tracking-tight whitespace-nowrap transition hover:text-blue-600 dark:hover:text-blue-400"
          >
            {/* Kucuk ekranda kisa ad, sm ve ustunde tam ad.
                hidden / sm:inline ikilisi ayni bilgiyi iki bicimde sunar. */}
            <span className="sm:hidden">A. Cengiz</span>
            <span className="hidden sm:inline">Abdüssamed Cengiz</span>
          </Link>

          <div className="flex items-center gap-6 text-sm">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "font-medium text-blue-600 dark:text-blue-400"
                    : "text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Sag: tema + oturum */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-sm ${
                    isActive
                      ? "font-medium text-blue-600 dark:text-blue-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  }`
                }
              >
                Panel
              </NavLink>

              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Çıkış
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Giriş
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
