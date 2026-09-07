import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

// Token'i cozup kullaniciyi VERITABANINDAN okur.
//
// Rolu token'in icine gomup tek sorgudan kacinabilirdik. Gommedik:
// token 7 gun gecerli, ve rolu token'a yazarsak yetkisi alinan bir
// kullanici bir hafta daha yonetici kalirdi. Veritabanindan okumak
// bir birincil anahtar aramasi (indeksli, cok ucuz) karsiliginda
// yetki degisikligini ANINDA gecerli kilar.
//
// null doner -> token yok, gecersiz, suresi dolmus ya da
// kullanici bu arada silinmis.
async function resolveUser(req: Request) {
  const header = req.headers.authorization;

  // Beklenen format: "Bearer eyJhbGciOi..."
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  // "Bearer " tam 7 karakter.
  const token = header.slice(7);

  let userId: string;
  try {
    // Imza gecersiz ya da sure dolmussa hata firlatir.
    userId = verifyToken(token).userId;
  } catch {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
}

// ZORUNLU GIRIS
// Token yoksa ya da gecersizse zinciri KESER (401).
export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const user = await resolveUser(req);

  if (!user) {
    // Token'in neden reddedildigini (bozuk mu, suresi mi dolmus)
    // SOYLEMIYORUZ -- saldirgana bilgi vermenin faydasi yok.
    throw ApiError.unauthorized("Geçersiz veya süresi dolmuş oturum");
  }

  req.user = user;
  next();
}

// OPSIYONEL GIRIS
// Token varsa kullaniciyi doldurur, YOKSA da isteği gecirir.
//
// Bu ayrim taslaklar icin gerekli: /api/posts herkese aciktir ama
// giris yapmis bir yonetici ayni adresten taslaklarini da gormeli.
// requireAuth kullansaydik blog sayfasi ziyaretcilere kapanirdi;
// hic kontrol etmeseydik taslaklar herkese acilirdi.
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const user = await resolveUser(req);

  if (user) {
    req.user = user;
  }

  next();
}

// YETKI KONTROLU
// requireAuth'tan SONRA baglanir: o "kim oldugunu" dogrular,
// bu "ne yapabilecegine" bakar.
//
// Kimlik dogrulama (authentication) ile yetkilendirme (authorization)
// ayri iki sorudur. Onceden yalnizca birincisi soruluyordu:
// gecerli token'i olan herkes her yaziyi silebiliyordu.
export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  if (req.user.role !== "ADMIN") {
    // 401 degil 403: kimligi biliyoruz, yetkisi yetmiyor.
    // Istemci bu ayrimi gorup "tekrar giris yap" demek yerine
    // "yetkiniz yok" diyebilir.
    throw ApiError.forbidden();
  }

  next();
}
