import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

    // ORTAM DEGISKENLERI
    //
    // config/env.ts acilista semayi calistirir ve eksik degisken
    // bulursa process.exit(1) der -- testler de bu kuraldan muaf degil.
    // Buradaki degerler SAHTE: veritabanina hic baglanilmiyor
    // (prisma modulu testlerde taklit ediliyor), ama semanin
    // bicim kurallarini gecmeleri gerekiyor.
    //
    // JWT_SECRET gercek bir sirri DEGIL, yalnizca 32 karakter
    // kuralini saglayan sabit bir test degeri.
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
      JWT_SECRET: "test-ortami-icin-sabit-anahtar-0123456789",
    },

    include: ["src/**/*.test.ts"],
  },
});
