import jwt from "jsonwebtoken";
import { env } from "../config/env";

// Gizli anahtar artik dogrudan process.env'den degil, dogrulanmis
// yapilandirmadan geliyor (config/env.ts). Oradaki sema anahtarin
// VAR oldugunu ve en az 32 karakter oldugunu garanti ettigi icin
// burada ayrica kontrol etmeye ve tipini daraltmaya gerek kalmadi.
const SECRET = env.JWT_SECRET;

// Token'in icine ne koydugumuzu tek yerde tanimliyoruz.
// Payload HERKES tarafindan okunabilir -> sadece userId.
export type TokenPayload = {
  userId: string;
};

export function signToken(userId: string): string {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
}

// Imza gecersizse ya da suresi dolmussa jwt.verify HATA FIRLATIR.
// Yakalamiyoruz: bu fonksiyonu cagiran middleware karar verecek (401).
export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, SECRET);

  // "as TokenPayload" ile gecistirmiyoruz.
  //
  // jwt.verify'in donus tipi "string | JwtPayload" -- yani token'in
  // icinde ne oldugunu TypeScript bilemez. Dogrudan "as" yazmak
  // derleyiciye yalan soylemek olurdu: imza gecerli ama payload
  // beklendigi gibi degilse (eski format, elle uretilmis token)
  // hata calisma zamaninda, alakasiz bir yerde patlardi.
  //
  // Bunun yerine GERCEKTEN kontrol ediyoruz.
  if (
    typeof decoded === "string" ||
    typeof decoded.userId !== "string"
  ) {
    throw new Error("Token icerigi beklenen bicimde degil");
  }

  // Bu noktada TypeScript decoded.userId'nin string oldugunu BILIYOR.
  return { userId: decoded.userId };
}
