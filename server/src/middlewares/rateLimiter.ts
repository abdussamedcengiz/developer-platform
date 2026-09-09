import rateLimit from "express-rate-limit";
import { isTest } from "../config/env";

// HIZ SINIRLAMA (rate limiting)
//
// Sorun: /api/auth/login herkese acik ve sifre dogruluyor.
// Bir saldirgan saniyede yuzlerce istek atip sifre deneyebilir.
// bcrypt'in yavasligi bunu zorlastirir ama engellemez --
// ustelik her deneme sunucunun CPU'sunu mesgul eder.
//
// ONEMLI: bu middleware'in dogru calismasi app.ts'teki
// "trust proxy" ayarina baglidir. Render gibi bir proxy arkasinda
// o ayar olmadan req.ip TUM ziyaretciler icin proxy'nin adresini
// dondururdu -- yani herkes ayni sayaci paylasir, siniri bir
// kisi doldurunca digerleri de engellenirdi.

// Testlerde sinir devre disi: 10 istekten sonra testler
// birbirini engellerdi ve hata mesaji yaniltici olurdu.
const skip = () => isTest;

// Giris/kayit gibi kimlik islemleri: dar sinir.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakikalik pencere
  limit: 10, // pencere basina en fazla 10 istek
  skip,

  // Modern "RateLimit" basliklarini gonder, eski "X-RateLimit-*" olanlari gonderme.
  // Istemci kac hakki kaldigini bu basliklardan gorebilir.
  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    error: "Çok fazla deneme yaptınız. Lütfen 15 dakika sonra tekrar deneyin.",
  },
});

// TUM API ICIN GENEL SINIR.
//
// Onceden yalnizca giris korunuyordu. Ama /api/posts de bedava
// degil: her istek bir veritabani sorgusu demek. Ucretsiz Render
// planinda birkac yuz istek/dakika servisi cokertmeye yeter.
//
// Sinir bilerek genis: normal bir ziyaretci sayfa gezerken
// dakikada 10-20 istek atar, 300'e yaklasmaz.
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 dakika
  limit: 300,
  skip,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Çok fazla istek gönderildi. Lütfen biraz bekleyin.",
  },
});

// NOT: bu sayaclar SUNUCU BELLEGINDE tutulur.
// Sunucu yeniden baslarsa sifirlanir; birden fazla sunucu
// ornegi calisirsa her biri kendi sayacini tutar.
// Gercek trafikte cozum Redis gibi ortak bir depodur --
// bu proje olceginde bellek yeterli.
