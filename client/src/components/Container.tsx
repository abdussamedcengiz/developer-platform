import type { ReactNode } from "react";

// Sayfa genisligini TEK yerden yoneten sarmalayici.
//
// Onceden genislik App.tsx'teki <main> uzerinde sabitti (max-w-3xl).
// Bu, metin sayfalari icin dogru olcu -- ama proje izgarasi gibi
// iki sutunlu icerikleri gereksiz sikistiriyordu.
//
// Cozum: genislik karari sayfaya birakiliyor, ama SERBEST birakilmiyor.
// Uc olcuden birini seciyorsun; boylece sayfalar arasi tutarlilik korunuyor.
//
//   sm -> form/giris gibi tek sutunlu dar icerik
//   md -> okunabilir metin olcusu (~70 karakter)
//   lg -> izgara ve vitrin sayfalari
const widths = {
  sm: "max-w-md",
  md: "max-w-3xl",
  lg: "max-w-5xl",
} as const;

type ContainerProps = {
  children: ReactNode;
  size?: keyof typeof widths;
  className?: string;
};

function Container({ children, size = "md", className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${widths[size]} px-5 sm:px-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default Container;
