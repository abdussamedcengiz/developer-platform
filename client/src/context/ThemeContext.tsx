import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { THEME_KEY } from "../constants";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1) Kullanicinin daha once yaptigi secim varsa ona uy.
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;

    // 2) Yoksa isletim sisteminin tercihine bak.
    //    matchMedia: CSS media query'sini JavaScript'ten sorgular.
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Bu useEffect bir VERI CEKME degil, bir SENKRONIZASYON.
  // React state'ini React'in disindaki iki sisteme yansitiyor:
  //   - DOM (<html> etiketinin sinifi)
  //   - localStorage
  //
  // "Yan etki" tam olarak bu demek: render disi bir seyi degistirmek.
  useEffect(() => {
    const root = document.documentElement; // <html>

    // classList.toggle(sinif, kosul): kosul true ise ekler, false ise cikarir.
    root.classList.toggle("dark", theme === "dark");

    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    // Fonksiyonel guncelleme: mevcut degere gore yenisini uret.
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme, ThemeProvider içinde kullanılmalı");
  }

  return context;
}
