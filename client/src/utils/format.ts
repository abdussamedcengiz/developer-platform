// Bicimlendirme yardimcilari.
//
// Ayni tarih bicimi 6 dosyada elle yaziliyordu. Bir gun "3 Eylul 2026"
// yerine "03.09.2026" istersek 6 yeri degistirmek gerekirdi --
// ve biri mutlaka atlanirdi.

const DATE_LOCALE = "tr-TR";

// "3 Eylül 2026"
export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString(DATE_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// "03.09.2026" -- liste ve tablolarda yer kazanmak icin kisa bicim.
export function formatDateShort(value: string | Date): string {
  return new Date(value).toLocaleDateString(DATE_LOCALE);
}

// <time datetime="..."> icin makine okunur bicim: "2026-09-03".
// Ekran okuyucular ve arama motorlari bu attribute'a bakar.
export function toISODate(value: string | Date): string {
  return new Date(value).toISOString().slice(0, 10);
}

// Tahmini okuma suresi.
//
// 200 kelime/dakika yaygin kabul goren bir ortalama. Kesin degil --
// zaten amac kesinlik degil, okuyucunun "simdi mi okusam sonra mi"
// kararini verebilmesi. En az 1 dakika donuyoruz; "0 dk okuma"
// anlamsiz gorunurdu.
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
