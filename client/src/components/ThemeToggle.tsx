import { useTheme } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "./Icons";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const label = theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      // aria-label: butonun icinde metin yok, sadece ikon var.
      // Ekran okuyucu kullanicilari icin ne yaptigini soylemek sart.
      aria-label={label}
      title={label}
      className="group relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    >
      {/* Iki ikon da her zaman DOM'da; biri donerek kayboluyor,
          digeri donerek geliyor. Kosullu render ile ani bir takas
          yapsaydik gecis olmazdi -- CSS var olmayan bir elemani
          animasyonlayamaz. */}
      <span className="relative block h-5 w-5">
        <SunIcon
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            theme === "dark"
              ? "scale-100 rotate-0 opacity-100"
              : "scale-50 -rotate-90 opacity-0"
          }`}
        />
        <MoonIcon
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            theme === "dark"
              ? "scale-50 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          }`}
        />
      </span>
    </button>
  );
}

export default ThemeToggle;
