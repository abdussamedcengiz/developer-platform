import { vi } from "vitest";

// PRISMA TAKLIDI
//
// Testler gercek bir veritabanina baglanmiyor. Sebep pratik:
// CI'da Postgres ayaga kaldirmak her kosuya dakikalar ekler ve
// testleri agin/imajin durumuna bagimli kilar.
//
// Burada dogrulamak istedigimiz sey zaten SQL degil, KARAR:
// "anonim istekte taslak filtresi uygulandi mi?",
// "USER rolu 403 aliyor mu?". Bunlar icin sorgunun hangi
// argumanlarla cagrildigini gormek yeterli.
//
// Gercek sema uyumunu "npm run typecheck" ve Prisma'nin urettigi
// tipler garanti ediyor.
export const prismaMock = {
  post: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  project: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  $disconnect: vi.fn(),
};

export function resetPrismaMock() {
  for (const model of Object.values(prismaMock)) {
    if (typeof model === "function") continue;
    for (const fn of Object.values(model)) {
      fn.mockReset();
    }
  }
}

// Testlerde kullanilan ornek kayitlar.
// Tarihler sabit: "bugun"e bagli bir test yarin baska sonuc verir.
const SABIT_TARIH = new Date("2026-01-01T00:00:00.000Z");

export const yayindakiYazi = {
  id: 1,
  title: "Yayindaki Yazi",
  slug: "yayindaki-yazi",
  content: "Bu yazi herkese acik.",
  excerpt: null,
  published: true,
  createdAt: SABIT_TARIH,
  updatedAt: SABIT_TARIH,
  authorId: "kullanici-1",
};

export const taslakYazi = {
  ...yayindakiYazi,
  id: 2,
  title: "Gizli Taslak",
  slug: "gizli-taslak",
  content: "Bu yazi henuz yayinlanmadi ve disari sizmamali.",
  published: false,
};

export const adminKullanici = { id: "kullanici-1", role: "ADMIN" as const };
export const normalKullanici = { id: "kullanici-2", role: "USER" as const };
