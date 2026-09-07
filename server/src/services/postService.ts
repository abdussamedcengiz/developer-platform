import { prisma } from "../lib/prisma";
import type {
  CreatePostInput,
  UpdatePostInput,
} from "../validation/schemas";

// SERVICE KATMANI
// Buradaki fonksiyonlar HTTP'yi hic bilmez: req, res, status kodu yok.
// Sadece "veriyle ne yapiyoruz" sorusunu cevaplar.
//
// Girdi tipleri artik burada elle tanimlanmiyor; zod semalarindan
// tureniyor (validation/schemas.ts). Boylece dogrulanan sey ile
// kaydedilen sey birbirinden ayrisamaz.

// GORUNURLUK
//
// Bu projedeki en onemli kural burasi: "published" alani yalnizca
// arayuzde bir rozet degil, bir ERISIM SINIRIDIR.
//
// Onceden findMany hicbir filtre uygulamiyordu; yayinlanmamis
// taslaklarin tam icerigi /api/posts uzerinden herkese aciktir.
// Artik taslaklari yalnizca yonetici gorebilir.
//
// Filtreyi cagiran katmana birakmiyoruz: her cagri yerinde
// "where" yazmayi unutmak mumkun olurdu. Varsayilan GUVENLI olsun
// diye taslaklari gormek ACIKCA istenmeli.
type Visibility = {
  includeDrafts?: boolean;
};

// includeDrafts false/verilmemis ise yalnizca yayindakiler.
function visibilityFilter({ includeDrafts = false }: Visibility) {
  return includeDrafts ? {} : { published: true };
}

export function getAllPosts(options: Visibility = {}) {
  return prisma.post.findMany({
    where: visibilityFilter(options),
    orderBy: { createdAt: "desc" }, // en yeni yazi ustte
  });
}

export function getPostBySlug(slug: string, options: Visibility = {}) {
  // findUnique yalnizca benzersiz alanla calisir; ek kosul
  // ekleyemeyiz. findFirst hem slug'a hem gorunurluge bakabilir.
  //
  // Bunun guvenlik acisindan guzel bir yan etkisi var: yetkisiz
  // biri taslagin slug'ini bilse bile 404 alir -- "boyle bir yazi
  // var ama goremezsin" (403) demek, yazinin varligini sizdirirdi.
  return prisma.post.findFirst({
    where: { slug, ...visibilityFilter(options) },
  });
}

// authorId AYRI bir parametre, CreatePostInput'un icinde DEGIL.
// Sebep: bu deger istemciden gelmiyor, token'dan geliyor.
// Tipe koysaydik controller yanlislikla req.body'den doldurabilirdi --
// ve istemci baskasinin adina yazi olusturabilirdi.
// Ayrimi tipe yazarak bu hatayi IMKANSIZ hale getiriyoruz.
export function createPost(data: CreatePostInput, authorId: string) {
  return prisma.post.create({
    data: { ...data, authorId },
  });
}

export function updatePost(slug: string, data: UpdatePostInput) {
  return prisma.post.update({
    where: { slug },
    data,
  });
}

export function deletePost(slug: string) {
  return prisma.post.delete({
    where: { slug },
  });
}
