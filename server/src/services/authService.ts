import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { signToken } from "../utils/jwt";

// bcrypt "cost" degeri. Her artis sureyi IKIYE katlar.
// 10 -> ~100ms. Yavas olmasi kasitli: kaba kuvvet saldirisini pahali kilar.
const SALT_ROUNDS = 10;

// SAHTE HASH -- ZAMANLAMA SALDIRISINA KARSI.
//
// Sorun: kullanici bulunamadiginda bcrypt.compare hic calismiyordu.
// Yani var olmayan bir e-posta ~1ms'te, var olan bir e-posta ~100ms'te
// cevap doner. Saldirgan cevabin ICERIGINE degil, SURESINE bakarak
// hangi e-postalarin kayitli oldugunu tek tek ogrenebilirdi.
// (Kodda "user enumeration'i onluyoruz" yaziyordu; mesaj ayni olsa da
//  zamanlama sizdiriyordu.)
//
// Cozum: kullanici yoksa da ayni maliyetli islemi yap. Bu hash
// gecerli bir bcrypt ciktisi; karsilastirma HER ZAMAN basarisiz olur
// ama AYNI SUREYI alir.
//
// Modul yuklenirken bir kez uretiliyor: her istekte yeniden
// hash'lemek sunucuyu bosuna mesgul ederdi.
const DUMMY_HASH = bcrypt.hashSync("zamanlama-saldirisina-karsi", SALT_ROUNDS);

export async function registerUser(
  email: string,
  password: string,
  name?: string,
) {
  // Sifreyi asla duz metin saklamiyoruz. hash tek yonludur:
  // bu degerden geriye sifre uretilemez.
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // E-postanin zaten var olup olmadigini KONTROL ETMIYORUZ.
  // Sebep: iki sorgu arasinda baskasi ayni e-postayi kaydedebilir
  // (yaris durumu). @unique kisiti zaten atomik; Prisma P2002 firlatir,
  // merkezi hata isleyici onu 409'a cevirir.
  //
  // DIKKAT: "role" BURADA VERILMIYOR. Sema varsayilani USER'dir.
  // Kayit yoluyla yonetici olunamaz; yonetici yalnizca seed ile
  // atanir (prisma/seed.ts).
  const user = await prisma.user.create({
    data: { email, password: passwordHash, ...(name ? { name } : {}) },
    omit: { password: true }, // donen nesnede hash HIC olmasin
  });

  const token = signToken(user.id);

  return { user, token };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Sifreyi geri cozmuyoruz; gelen sifreyi ayni sekilde hashleyip
  // kayitli hash ile karsilastiriyoruz. bcrypt salt'i hash'in
  // icinden okuyup ayni islemi tekrarlar.
  //
  // Kullanici yoksa sahte hash ile karsilastiriyoruz: sonuc her
  // durumda false, ama gecen sure ayni.
  const passwordMatches = await bcrypt.compare(
    password,
    user?.password ?? DUMMY_HASH,
  );

  // Iki basarisizlik durumunu (kullanici yok / sifre yanlis)
  // AYIRT ETMIYORUZ ki cagiran katman yanlislikla
  // "e-posta bulunamadi" gibi bir bilgi sizdiramasin.
  if (!user || !passwordMatches) {
    return null;
  }

  // findUnique sifreyi getirmek zorundaydi (karsilastirma icin),
  // ama cevaba koyamayiz. Destructuring + rest ile ayikliyoruz.
  const { password: _password, ...safeUser } = user;

  const token = signToken(user.id);

  return { user: safeUser, token };
}

// Token'i gecerli olan kullanicinin tam bilgisi.
// omit ile sifre hash'i hicbir kod yolunda disari cikamaz.
export function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  });
}
