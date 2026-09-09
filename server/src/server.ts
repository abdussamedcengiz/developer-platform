import app from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

// "dotenv/config" burada DEGIL, config/env.ts'in ilk satirinda.
// Ortam degiskenleri okunmadan once hicbir modul onlara bakmamali.

// listen() = "bu portu dinlemeye basla".
// Bu satir calistiginda program BITMEZ; istek beklemeye devam eder.
const server = app.listen(env.PORT, () => {
  console.log(
    `Server calisiyor -> http://localhost:${env.PORT} (${env.NODE_ENV})`,
  );
});

// --- DUZGUN KAPANMA (graceful shutdown) ---
//
// Render yeni bir surum yayina alirken eski surume SIGTERM gonderir.
// Bu sinyali dinlemezsek Node aniden olur:
//   - O anda islenen istekler yarida kesilir (kullanici hata gorur).
//   - Veritabani baglantilari duzgun kapanmaz; Neon'un baglanti
//     havuzunda bir sure "olu" baglantilar kalir.
//
// server.close() YENI baglanti kabul etmeyi birakir ama devam eden
// istekleri bitirmeyi bekler. Ardindan Prisma'yi kapatiyoruz.
async function shutdown(signal: string) {
  console.log(`${signal} alindi, sunucu kapaniyor...`);

  // Kapanma takilirsa (uzun suren bir istek, asili baglanti)
  // surekli beklemeyelim. Render zaten bir sure sonra zorla
  // sonlandirir; once biz temiz bir cikis deneriz.
  const forceExit = setTimeout(() => {
    console.error("Kapanma zaman asimina ugradi, zorla cikiliyor.");
    process.exit(1);
  }, 10_000);

  // Zamanlayici acikken Node kapanmaz; unref ile "bu sayaci
  // beklemeye deger sayma" diyoruz.
  forceExit.unref();

  server.close(async (error) => {
    if (error) {
      console.error("Sunucu kapatilirken hata:", error);
    }

    await prisma.$disconnect();
    console.log("Kapandi.");
    process.exit(error ? 1 : 0);
  });
}

// SIGTERM: platformun "kapan" istegi. SIGINT: terminalde Ctrl+C.
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
