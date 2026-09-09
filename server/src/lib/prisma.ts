import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { env, isProduction } from "../config/env";

// Prisma 7'de baglantiyi Prisma degil, "pg" surucusu kurar.
// Adapter, ikisi arasindaki koprudur.
//
// DATABASE_URL'in var oldugunu config/env.ts acilista dogruladi;
// burada tekrar kontrol etmiyoruz.

// Uygulamanin TAMAMINDA tek bir PrismaClient ornegi kullanilir.
// Her "new PrismaClient()" yeni bir baglanti havuzu acar;
// her dosyada yenisini olusturursan baglantilar tukenir.
//
// tsx watch her degisiklikte modulleri yeniden yukler.
// globalThis yeniden yuklemede sifirlanmadigi icin
// ornegi orada saklayip tekrar tekrar olusturmayi engelliyoruz.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
  });

// Canlida modul yeniden yukleme yok, bu numaraya gerek de yok.
if (!isProduction) {
  globalForPrisma.prisma = prisma;
}
