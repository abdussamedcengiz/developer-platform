import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

// MIDDLEWARE = istek ile controller arasindaki ara durak.
// Bu middleware iki is yapar:
//   1. Token gecerli mi? Degilse zinciri KESER (401).
//   2. Gecerliyse req.userId'yi doldurup next() ile devam ettirir.
//
// express.json() req.body'yi dolduruyordu; bu da req.userId'yi dolduruyor.
// Ayni fikir, farkli veri.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  // Beklenen format: "Bearer eyJhbGciOi..."
  // ?. -> header undefined ise hata firlatmadan undefined doner.
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Giriş yapmalısınız" });
    return; // next() CAGRILMIYOR -> zincir burada biter, controller'a gidilmez
  }

  // "Bearer " tam 7 karakter.
  const token = header.slice(7);

  try {
    // verifyToken imzayi dogrular ve suresini kontrol eder.
    // Ikisinden biri tutmazsa HATA FIRLATIR.
    const payload = verifyToken(token);

    // req sirasan bir JS nesnesi; uzerine alan ekleyebiliriz.
    // TypeScript'in bunu kabul etmesi icin types/express.d.ts'te
    // Request tipini genislettik.
    req.userId = payload.userId;

    // Zincire devam: sonraki middleware ya da controller calisir.
    next();
  } catch (error) {
    // Imza gecersiz, token bozuk, ya da suresi dolmus.
    // Hangisi oldugunu istemciye SOYLEMIYORUZ -- bilgi sizdirmanin gereksiz oldugu bir yer.
    console.error(error);
    res.status(401).json({ error: "Geçersiz veya süresi dolmuş token" });
  }
}
