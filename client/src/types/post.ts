// Backend'in dondugu JSON'un TypeScript karsiligi.
// Bu dosya "API sozlesmesi": backend ne donuyorsa burada o yazar.

export type Post = {
  id: number
  title: string
  slug: string
  content: string

  // Prisma'da "String?" idi -> JSON'da null gelebilir.
  excerpt: string | null

  published: boolean

  // DIKKAT: Date DEGIL, string.
  // JSON'da tarih tipi yoktur; her tarih metne cevrilerek gonderilir.
  // Ornek: "2026-08-20T16:42:55.749Z"
  // Tarih islemi yapacaksan once new Date(post.createdAt) demelisin.
  createdAt: string
  updatedAt: string

  authorId: string | null
}
