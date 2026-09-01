import { prisma } from '../lib/prisma'

// SERVICE KATMANI
// Buradaki fonksiyonlar HTTP'yi hic bilmez: req, res, status kodu yok.
// Sadece "veriyle ne yapiyoruz" sorusunu cevaplar.
// Ayni fonksiyonlari yarin bir CLI aracindan, zamanlanmis bir gorevden
// veya React Native uygulamasinin backend'inden de cagirabilirsin.

// Fonksiyonlarin bekledigi veri sekli. Boylece controller'in
// dogru alanlari gonderdigini TypeScript kontrol eder.
type CreatePostInput = {
  title: string
  slug: string
  content: string
  excerpt?: string
}

// Guncellemede her alan opsiyonel: gonderilmeyenler degismez.
type UpdatePostInput = {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  published?: boolean
}

export function getAllPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' }, // en yeni yazi ustte
  })
}

export function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
  })
}

// authorId AYRI bir parametre, CreatePostInput'un icinde DEGIL.
// Sebep: bu deger istemciden gelmiyor, token'dan geliyor.
// Tipe koysaydik controller yanlislikla req.body'den doldurabilirdi --
// ve istemci baskasinin adina yazi olusturabilirdi.
// Ayrimi tipe yazarak bu hatayi IMKANSIZ hale getiriyoruz.
export function createPost(data: CreatePostInput, authorId: string) {
  return prisma.post.create({
    data: { ...data, authorId },
  })
}

export function updatePost(slug: string, data: UpdatePostInput) {
  return prisma.post.update({
    where: { slug },
    data,
  })
}

export function deletePost(slug: string) {
  return prisma.post.delete({
    where: { slug },
  })
}
