// Basliktan URL'e uygun slug uretir.
// "React Hook'ları Rehberi" -> "react-hooklari-rehberi"
//
// PostFormPage ve ProjectFormPage ikisi de bunu kullanir.
// Kopyalasaydik, yarin bir harf ekledigimizde iki yerde duzeltmemiz gerekirdi.

const turkce: Record<string, string> = {
  ı: "i", İ: "i",
  ş: "s", Ş: "s",
  ğ: "g", Ğ: "g",
  ü: "u", Ü: "u",
  ö: "o", Ö: "o",
  ç: "c", Ç: "c",
};

export function slugify(text: string): string {
  return text
    .split("")
    .map((harf) => turkce[harf] ?? harf) // Turkce harfleri sadelestir
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // harf, rakam, bosluk, tire disini at
    .trim()
    .replace(/\s+/g, "-") // bosluklari tireye cevir
    .replace(/-+/g, "-"); // ard arda tireleri teke indir
}
