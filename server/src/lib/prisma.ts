import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

// Prisma 7'de baglantiyi Prisma degil, "pg" surucusu kurar.
// Adapter, ikisi arasindaki koprudur.
const connectionString = process.env.DATABASE_URL

// Erken uyari: .env eksikse sunucu daha ilk saniyede,
// anlasilir bir mesajla dursun. Aksi halde ilk sorguda
// anlamsiz bir hata alirdin.
if (!connectionString) {
  throw new Error('DATABASE_URL tanimli degil. server/.env dosyasini kontrol et.')
}

// Uygulamanin TAMAMINDA tek bir PrismaClient ornegi kullanilir.
// Her "new PrismaClient()" yeni bir baglanti havuzu acar;
// her dosyada yenisini olusturursan baglantilar tukenir.
//
// tsx watch her degisiklikte modulleri yeniden yukler.
// globalThis yeniden yuklemede sifirlanmadigi icin
// ornegi orada saklayip tekrar tekrar olusturmayi engelliyoruz.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  })

// Canlida modul yeniden yukleme yok, bu numaraya gerek de yok.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
