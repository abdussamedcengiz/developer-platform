import type { Request, Response } from "express";
import * as authService from "../services/authService";
import { ApiError } from "../utils/ApiError";
import type { LoginInput, RegisterInput } from "../validation/schemas";

// Dogrulama (alan var mi, e-posta gecerli mi, sifre yeterince uzun mu)
// artik burada degil, route'a bagli validateBody middleware'inde.
// P2002 -> 409 cevirimi de merkezi hata isleyicide.
// Geriye controller'in asil isi kaldi: service'i cagirip cevabi yazmak.

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body as RegisterInput;

  const result = await authService.registerUser(email, password, name);

  // 201 = yeni kaynak olusturuldu.
  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginInput;

  const result = await authService.loginUser(email, password);

  // null = ya kullanici yok ya sifre yanlis.
  // Hangisi oldugunu SOYLEMIYORUZ: saldirgan hangi e-postalarin
  // kayitli oldugunu ogrenmesin (user enumeration).
  if (!result) {
    throw ApiError.unauthorized("E-posta veya şifre hatalı");
  }

  res.json(result);
}

// OTURUM DOGRULAMA
//
// Arayuz token'i localStorage'da tutuyor ve 7 gun gecerli.
// Sure dolunca istemci bunu KENDI BASINA anlayamazdi: elinde bir
// token var, "giris yapilmis" sayiyor, ama her istek 401 donuyordu.
//
// Bu endpoint arayuze acilista "token hala gecerli mi, ben kimim?"
// diye sorma imkani verir. Gecersizse requireAuth 401 doner ve
// arayuz oturumu temizler.
export async function me(req: Request, res: Response) {
  // requireAuth bu alani doldurdu; buraya user'siz gelinemez.
  if (!req.user) {
    throw ApiError.unauthorized();
  }

  // Cevabin sekli /login ile AYNI olsun diye tam kullaniciyi
  // getiriyoruz: arayuz iki yerde farkli tiplerle ugrasmasin.
  const user = await authService.getUserById(req.user.id);

  if (!user) {
    // requireAuth ile bu cagri arasinda kullanici silinmis olabilir.
    throw ApiError.unauthorized("Oturum artık geçerli değil");
  }

  res.json({ user });
}
