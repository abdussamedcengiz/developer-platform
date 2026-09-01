import jwt from "jsonwebtoken";

// Gizli anahtar sadece burada okunur. Iki yerde tekrarlamiyoruz.
// Eksikse sunucu ilk saniyede, anlasilir bir mesajla durur (fail fast).
const rawSecret = process.env.JWT_SECRET;

if (!rawSecret) {
  throw new Error("JWT_SECRET tanimli degil. server/.env dosyasini kontrol et.");
}

// DARALTILMIS DEGERI YAKALIYORUZ.
//
// TypeScript'in tip daraltmasi FONKSIYON SINIRINI GECMEZ:
// yukaridaki "if" sayesinde burada rawSecret'in tipi "string",
// ama asagidaki fonksiyonlarin ICINDE yine "string | undefined" olur.
// Sebep: fonksiyonlar ileride, baska bir zamanda cagrilacak ve
// derleyici o ana kadar degiskenin durumunu garanti edemez.
//
// Bu satir daraltilmis degeri kalici olarak "string" tipli
// yeni bir sabite kopyalar. Artik her yerde guvenle kullanilabilir.
const SECRET: string = rawSecret;

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
