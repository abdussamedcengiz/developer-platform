// YUKLENME ISKELETLERI
//
// "Yukleniyor..." yazisinin iki sorunu var:
//   1) Bekleme suresi olduğundan uzun hissettirir.
//   2) Veri gelince sayfa aniden buyur, icerik ziplar (layout shift).
//
// Iskelet, gelecek icerigin SEKLINI onceden cizer. Kutu boyutlari
// gercek kartlarla ayni oldugu icin veri gelince yer degistirme olmaz.
//
// aria-hidden + role="status": ekran okuyucu gri kutulari okumaya
// calismaz, bunun yerine "Yukleniyor" bilgisini bir kez duyurur.

function Bar({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

// Blog listesi icin: baslik + tarih + iki satir ozet.
export function PostCardSkeleton() {
  return (
    <div className="border-b border-slate-200 py-6 last:border-0 dark:border-slate-800">
      <Bar className="h-6 w-2/3" />
      <Bar className="mt-3 h-4 w-32" />
      <Bar className="mt-4 h-4 w-full" />
      <Bar className="mt-2 h-4 w-4/5" />
    </div>
  );
}

// Proje izgarasi icin: kart cercevesi + baslik + aciklama + baglantilar.
export function ProjectCardSkeleton() {
  return (
    <div className="card p-5">
      <Bar className="h-5 w-1/2" />
      <Bar className="mt-4 h-4 w-full" />
      <Bar className="mt-2 h-4 w-5/6" />
      <Bar className="mt-6 h-4 w-24" />
    </div>
  );
}

// Yonetim panelindeki liste satiri.
export function ListRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex-1">
        <Bar className="h-4 w-1/3" />
        <Bar className="mt-2 h-3 w-24" />
      </div>
      <Bar className="h-4 w-20" />
    </div>
  );
}

// Ayni iskeleti n kez tekrarlamak icin kucuk bir sarmalayici.
// Array.from({length: n}) -> [undefined, undefined, ...] uretir;
// map ile index'e gore key veriyoruz (liste statik, siralama degismiyor).
type SkeletonListProps = {
  count?: number;
  variant?: "post" | "project" | "row";
};

export function SkeletonList({
  count = 3,
  variant = "post",
}: SkeletonListProps) {
  const Item =
    variant === "project"
      ? ProjectCardSkeleton
      : variant === "row"
        ? ListRowSkeleton
        : PostCardSkeleton;

  return (
    <div
      role="status"
      aria-label="Yükleniyor"
      className={
        variant === "project" ? "grid gap-4 sm:grid-cols-2" : "animate-fade-in"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <Item key={i} />
      ))}

      {/* sr-only: ekranda gorunmez, ekran okuyucuda okunur. */}
      <span className="sr-only">Yükleniyor...</span>
    </div>
  );
}
