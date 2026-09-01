import rateLimit from "express-rate-limit";

// HIZ SINIRLAMA (rate limiting)
//
// Sorun: /api/auth/login herkese acik ve sifre dogruluyor.
// Bir saldirgan saniyede yuzlerce istek atip sifre deneyebilir.
// bcrypt'in yavasligi bunu zorlastirir ama engellemez --
// ustelik her deneme sunucunun CPU'sunu mesgul eder.
//
// Cozum: ayni IP'den gelen istek sayisini sinirla.
// Bu da bir middleware; requireAuth gibi zincire takiliyor.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakikalik pencere
  limit: 10, // pencere basina en fazla 10 istek

  // Modern "RateLimit" basliklarini gonder, eski "X-RateLimit-*" olanlari gonderme.
  // Istemci kac hakki kaldigini bu basliklardan gorebilir.
  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    error: "Çok fazla deneme yaptınız. Lütfen 15 dakika sonra tekrar deneyin.",
  },
});

// NOT: bu sayac SUNUCU BELLEGINDE tutulur.
// Sunucu yeniden baslarsa sifirlanir; birden fazla sunucu
// ornegi calisirsa her biri kendi sayacini tutar.
// Gercek trafikte cozum Redis gibi ortak bir depodur --
// bu proje olceginde bellek yeterli.
