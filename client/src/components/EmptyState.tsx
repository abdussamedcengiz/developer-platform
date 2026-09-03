import type { ReactNode } from "react";

// BOS VE HATALI DURUMLAR
//
// "Henuz yazi yok." tek satiri teknik olarak dogru ama kullaniciyi
// bosluga birakir. Iyi bir bos durum uc soruyu yanitlar:
//   Ne oldu? / Neden? / Simdi ne yapabilirim?
//
// Ayni bilesen hem "veri yok" hem "istek basarisiz" icin kullanilir;
// tek fark ton (nötr vs. kirmizi) ve eylem butonu.

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: "neutral" | "error";
};

function EmptyState({
  title,
  description,
  icon,
  action,
  tone = "neutral",
}: EmptyStateProps) {
  const isError = tone === "error";

  return (
    <div
      // role="alert": hata mesaji ekran okuyucuya ANINDA duyurulur.
      // Notr bos durumda gerek yok -- kullanici zaten sayfayi okuyor.
      role={isError ? "alert" : undefined}
      className={`animate-fade-in rounded-2xl border border-dashed px-6 py-14 text-center ${
        isError
          ? "border-red-300 bg-red-50/50 dark:border-red-500/30 dark:bg-red-500/5"
          : "border-slate-300 dark:border-slate-700"
      }`}
    >
      {icon && (
        <div
          className={`mx-auto flex h-11 w-11 items-center justify-center rounded-xl ${
            isError
              ? "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {icon}
        </div>
      )}

      <p
        className={`font-semibold ${icon ? "mt-4" : ""} ${
          isError ? "text-red-700 dark:text-red-400" : ""
        }`}
      >
        {title}
      </p>

      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}

      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export default EmptyState;
