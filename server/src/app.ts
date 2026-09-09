import express from "express";
import cors from "cors";
import helmet from "helmet";
import postRoutes from "./routes/postRoutes";
import projectRoutes from "./routes/projectRoutes";
import authRoutes from "./routes/authRoutes";
import { apiLimiter } from "./middlewares/rateLimiter";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import { env, isProduction } from "./config/env";

// Express uygulamasini olusturuyoruz.
// Dikkat: bu dosya sunucuyu BASLATMAZ, sadece uygulamayi TANIMLAR.
// Bu ayrim testler icin sart: test dosyalari app'i alip supertest'e
// verir, gercek bir port dinlemeye gerek kalmaz.
const app = express();

// --- PROXY GUVENI ---
//
// Render (ve Vercel, Cloudflare, nginx...) istegi bize kendi
// uzerinden iletir. Bu ayar olmadan req.ip TUM ziyaretciler icin
// proxy'nin adresini dondurur. Sonuc: hiz sinirlayici herkesi
// TEK bir sayaçta toplar -- bir kisi siniri doldurunca butun
// site engellenir, gercek saldirgan ise hic ayirt edilemez.
//
// Deger 1: "onumde TEK bir proxy var, X-Forwarded-For'un son
// halkasina guven". "true" yazmak ZINCIRIN TAMAMINA guvenmek
// demektir ve istemci basligi taklit ederek sinirlamayi asabilir.
if (isProduction) {
  app.set("trust proxy", 1);
}

// --- MIDDLEWARE'LER ---
// Middleware = her istegin, route'a ulasmadan once ugradigi ara durak.
// Sirasi onemlidir: yukaridan asagiya calisirlar.

// 1) GUVENLIK BASLIKLARI
// helmet bir dizi HTTP basligini ayarlar: tarayiciya icerik turunu
// tahmin etmemesini (nosniff), sayfayi cerceve icine almamasini,
// referrer bilgisini sinirlamasini soyler.
//
// contentSecurityPolicy kapali: CSP sayfa ICERIGI icin anlamlidir,
// burasi ise yalnizca JSON donen bir API. Acik birakmak arayuzun
// (ayri bir servis) yuklemesini engelleyebilirdi.
//
// crossOriginResourcePolicy gevsetildi: arayuz farkli bir origin'de
// calisiyor ve bu API'yi okuyabilmeli.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// 2) CORS: tarayici, farkli bir port/domain'e istek atmayi varsayilan olarak engeller.
//    Client 5173'te, server 4000'de calisiyor -> farkli "origin" sayilir.
//
// CANLIDA sadece kendi arayuzumuze izin veriyoruz. Aksi halde
// herhangi bir site tarayicidan API'mize istek atabilir.
//
// "?? true" YALNIZCA gelistirme icin: orada CLIENT_URL tanimsizdir ve
// gelen origin oldugu gibi yansitilir. Production'da bu dala hic
// dusulmez -- config/env.ts, NODE_ENV=production iken CLIENT_URL'i
// zorunlu tutuyor ve tanimsizsa sunucu hic acilmiyor.
app.use(
  cors({
    origin: env.CLIENT_URL ?? true,
  }),
);

// 3) express.json(): gelen istegin govdesindeki (body) JSON metnini
//    JavaScript nesnesine cevirir ve req.body'ye koyar.
//
// limit: varsayilan zaten 100kb, ama acikca yazmak niyeti belli eder.
// Blog icerigi icin 100kb bol bol yeter (~100 bin karakter).
app.use(express.json({ limit: "100kb" }));

// 4) Genel hiz siniri. Kimlik islemlerinin kendi dar siniri
//    ayrica authRoutes icinde bagli.
app.use("/api", apiLimiter);

// --- SAGLIK KONTROLU ---
// Render bu adrese istek atip servisin ayakta oldugunu dogrular.
// Hiz sinirindan MUAF olmasi icin limiter'dan once tanimlanmadi --
// limiter /api'ye bagli ve 300/dk sinirini saglik kontrolu asmaz.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// --- KAYNAK ROUTE'LARI ---
// "/api/posts" ile baslayan her istek postRoutes'a devredilir.
app.use("/api/posts", postRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

// NOT: "/api/about" endpoint'i kaldirildi. Sabit veri donduruyordu
// ve arayuzdeki AboutPage onu hic cagirmiyordu -- olu koddu.

// --- HATA ISLEYICILER ---
// Bunlar EN SONA baglanmali: yukaridaki route'lardan hicbiri
// eslesmediginde sira notFoundHandler'a gelir, ve herhangi bir
// yerde firlatilan hata errorHandler'da toplanir.
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
