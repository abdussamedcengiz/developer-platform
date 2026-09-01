import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { signToken } from '../utils/jwt'

// bcrypt "cost" degeri. Her artis sureyi IKIYE katlar.
// 10 -> ~100ms. Yavas olmasi kasitli: kaba kuvvet saldirisini pahali kilar.
const SALT_ROUNDS = 10

export async function registerUser(email: string, password: string) {
  // Sifreyi asla duz metin saklamiyoruz. hash tek yonludur:
  // bu degerden geriye sifre uretilemez.
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  // E-postanin zaten var olup olmadigini KONTROL ETMIYORUZ.
  // Sebep: iki sorgu arasinda baskasi ayni e-postayi kaydedebilir
  // (yaris durumu). @unique kisiti zaten atomik; Prisma P2002 firlatir,
  // controller onu 409'a cevirir.
  const user = await prisma.user.create({
    data: { email, password: passwordHash },
    omit: { password: true }, // donen nesnede hash HIC olmasin
  })

  const token = signToken(user.id)

  return { user, token }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })

  // Kullanici yok -> null.
  if (!user) {
    return null
  }

  // Sifreyi geri cozmuyoruz; gelen sifreyi ayni sekilde hashleyip
  // kayitli hash ile karsilastiriyoruz. bcrypt salt'i hash'in
  // icinden okuyup ayni islemi tekrarlar.
  const passwordMatches = await bcrypt.compare(password, user.password)

  // Sifre yanlis -> yine null.
  // Iki basarisizlik durumunu AYIRT ETMIYORUZ ki controller yanlislikla
  // "e-posta bulunamadi" gibi bir bilgi sizdiramasin.
  if (!passwordMatches) {
    return null
  }

  // findUnique sifreyi getirmek zorundaydi (karsilastirma icin),
  // ama cevaba koyamayiz. Destructuring + rest ile ayikliyoruz.
  const { password: _password, ...safeUser } = user

  const token = signToken(user.id)

  return { user: safeUser, token }
}
