import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import { ApiError } from "../utils/ApiError";
import { isDevelopment, isTest } from "../config/env";

// TANIMSIZ ADRESLER
//
// Bu middleware TUM route'lardan SONRA baglanir: hicbiri eslesmediyse
// sira buraya gelir. Olmasaydi Express kendi HTML hata sayfasini
// donerdi -- JSON bekleyen istemci "Unexpected token <" hatasi alirdi.
export function notFoundHandler(req: Request, _res: Response) {
  throw ApiError.notFound(`${req.method} ${req.originalUrl} bulunamadı`);
}

// Prisma'nin hata kodlarini HTTP karsiliklarina ceviren tek yer.
// Onceden bu esleme her controller'da tekrar ediliyordu.
function fromPrisma(error: Prisma.PrismaClientKnownRequestError): ApiError {
  switch (error.code) {
    // P2002: benzersizlik kisiti ihlali -> ayni slug/e-posta zaten var.
    case "P2002":
      return ApiError.conflict("Bu kayıt zaten mevcut");

    // P2025: guncellenecek/silinecek satir bulunamadi.
    case "P2025":
      return ApiError.notFound("Kayıt bulunamadı");

    default:
      return new ApiError(500, "Beklenmeyen bir veritabanı hatası oluştu");
  }
}

// MERKEZI HATA ISLEYICI
//
// Express bir middleware'in DORT parametresi varsa onu hata isleyici
// sayar. Imzayi kisaltmak (ornegin kullanilmayan "next"i silmek)
// bu middleware'i sessizce devre disi birakir.
//
// Express 5, async handler'lardan donen reddedilmis promise'leri
// kendiliginden buraya yonlendirir; bu yuzden controller'larda
// try/catch sarmalayicilarina gerek kalmadi.
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  // 1) Bizim bilerek firlattigimiz hatalar.
  const apiError =
    error instanceof ApiError
      ? error
      : error instanceof Prisma.PrismaClientKnownRequestError
        ? fromPrisma(error)
        : // 2) express.json() bozuk JSON aldiginda SyntaxError firlatir
          //    ve uzerine "status" alani koyar.
          error instanceof SyntaxError && "status" in error
          ? ApiError.badRequest("İstek gövdesi geçerli bir JSON değil")
          : null;

  if (apiError) {
    // Beklenen hatalari loglamiyoruz: 404 ve 400 gunluk hayattir,
    // log'u doldurup gercek sorunlari gorunmez kilarlar.
    res.status(apiError.status).json({
      error: apiError.message,
      ...(apiError.details ? { details: apiError.details } : {}),
    });
    return;
  }

  // 3) Beklenmeyen hata: bu bir HATADIR, mutlaka gorulmeli.
  // Testlerde ciktiyi kirletmemesi icin susturuyoruz.
  if (!isTest) {
    console.error("[unhandled]", error);
  }

  // Ic ayrintilari (baglanti dizeleri, tablo adlari, dosya yollari)
  // istemciye YALNIZCA gelistirmede gonderiyoruz -- canlida bunlar
  // saldirgana harita cizmek olurdu.
  //
  // Kosul "production degilse" degil, "development ise": test
  // ortami da canli gibi davransin ki sizinti testi gercek
  // davranisi olcsun.
  res.status(500).json({
    error: "Sunucuda beklenmeyen bir hata oluştu",
    ...(isDevelopment && error instanceof Error
      ? { message: error.message }
      : {}),
  });
}
