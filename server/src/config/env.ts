import "dotenv/config";
import { z } from "zod";

// ORTAM DEGISKENLERI TEK YERDEN OKUNUR VE DOGRULANIR.
//
// Onceden her dosya process.env'e kendisi bakiyordu:
//   lib/prisma.ts   -> DATABASE_URL
//   utils/jwt.ts    -> JWT_SECRET
//   app.ts          -> CLIENT_URL
//   routes/auth.ts  -> ALLOW_REGISTRATION
//
// Bunun iki sorunu vardi:
//   1. Eksik bir degisken, o dosya ilk kez calisana kadar fark edilmiyordu.
//   2. "Hangi degiskenler gerekli?" sorusunun tek bir cevabi yoktu.
//
// Burasi o cevap. Uygulama acilirken sema calisir; bir sey eksik veya
// hataliysa sunucu ILK SANIYEDE, hangi degiskenin neden gecersiz
// oldugunu soyleyerek durur.
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Render PORT'u kendisi atar. Yerelde 4000.
  // coerce: process.env'den gelen her sey metindir, sayiya ceviriyoruz.
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL tanimli degil. server/.env dosyasini kontrol et."),

  // 32 karakter alt siniri kasitli: kisa bir anahtar kaba kuvvetle
  // kirilabilir ve JWT imzasi guvenilirligini kaybeder.
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET en az 32 karakter olmali. Uretmek icin: node -e \"console.log(require('crypto').randomBytes(48).toString('hex'))\""),

  // CORS'un izin verecegi arayuz adresi.
  // Gelistirmede tanimsiz -> Vite proxy kullanildigi icin gerekmez.
  CLIENT_URL: z.url().optional(),

  // Kayit endpoint'i. Varsayilan KAPALI.
  ALLOW_REGISTRATION: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // z.treeifyError yerine issue listesini elle biciyoruz:
  // amac terminalde okunabilir, tek satirlik maddeler.
  const lines = parsed.error.issues.map(
    (issue) => `  - ${issue.path.join(".")}: ${issue.message}`,
  );

  console.error("Ortam degiskenleri gecersiz:\n" + lines.join("\n"));

  // Yanlis yapilandirmayla acilan bir sunucu, hic acilmayandan kotudur:
  // hata saatler sonra alakasiz bir yerde ortaya cikar.
  process.exit(1);
}

export const env = parsed.data;

// Kod icinde "process.env.NODE_ENV === 'production'" tekrarini
// onlemek icin. Yazim hatasi yapilamaz, tek yerde tanimli.
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
export const isDevelopment = env.NODE_ENV === "development";
