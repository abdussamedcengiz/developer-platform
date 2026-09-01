import type { Request, Response } from 'express'
import { Prisma } from '../generated/prisma/client'
import * as postService from '../services/postService'

// CONTROLLER KATMANI
// Gorevi: istegi anlamak, dogrulamak, service'i cagirmak, cevabi uretmek.
// Prisma sorgusu BURADA yazilmaz -- o service'in isi.
// Buradaki tek Prisma bilgisi, hata kodlarini HTTP kodlarina cevirmek.

export async function listPosts(req: Request, res: Response) {
  try {
    const posts = await postService.getAllPosts()
    res.json(posts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Yazilar getirilirken bir hata olustu' })
  }
}

// Request<{ slug: string }> -> "bu route'un params'inda slug var" demek.
// Boyle yazmazsak TypeScript req.params.slug'i "string | undefined" sayar.
export async function getPost(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params

  try {
    const post = await postService.getPostBySlug(slug)

    if (!post) {
      res.status(404).json({ error: `"${slug}" slug'li yazi bulunamadi` })
      return
    }

    res.json(post)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Yazi getirilirken bir hata olustu' })
  }
}

export async function createPost(req: Request, res: Response) {
  // Alanlari tek tek aliyoruz: istemcinin gonderdigi fazlaliklar elenir.
  const { title, slug, content, excerpt } = req.body

  // authorId ISTEMCIDEN degil, TOKEN'dan geliyor.
  // requireAuth middleware'i bu alani doldurdu.
  const authorId = req.userId

  // requireAuth zaten garanti ediyor ama TypeScript bunu BILEMEZ:
  // types/express.d.ts'te userId "string | undefined" olarak tanimli.
  // Bu kontrol hem tipi daraltir hem de route'a yanlislikla
  // requireAuth eklemeyi unutursak bizi korur.
  if (!authorId) {
    res.status(401).json({ error: 'Giriş yapmalısınız' })
    return
  }

  // Dogrulama controller'in isi: "gelen istek gecerli mi?" sorusu HTTP'ye ait.
  if (!title || !slug || !content) {
    res.status(400).json({ error: 'title, slug ve content zorunludur' })
    return
  }

  try {
    const newPost = await postService.createPost(
      { title, slug, content, excerpt },
      authorId,
    )
    res.status(201).json(newPost)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res.status(409).json({ error: `"${slug}" slug'i zaten kullaniliyor` })
      return
    }

    console.error(error)
    res.status(500).json({ error: 'Yazi olusturulurken bir hata olustu' })
  }
}

export async function updatePost(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params
  const { title, slug: newSlug, content, excerpt, published } = req.body

  try {
    // Gonderilmeyen alanlar undefined kalir; Prisma onlari atlar.
    const updated = await postService.updatePost(slug, {
      title,
      slug: newSlug,
      content,
      excerpt,
      published,
    })

    res.json(updated)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: `"${slug}" slug'li yazi bulunamadi` })
        return
      }
      if (error.code === 'P2002') {
        res.status(409).json({ error: `"${newSlug}" slug'i zaten kullaniliyor` })
        return
      }
    }

    console.error(error)
    res.status(500).json({ error: 'Yazi guncellenirken bir hata olustu' })
  }
}

export async function deletePost(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params

  try {
    await postService.deletePost(slug)
    res.status(204).send()
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      res.status(404).json({ error: `"${slug}" slug'li yazi bulunamadi` })
      return
    }

    console.error(error)
    res.status(500).json({ error: 'Yazi silinirken bir hata olustu' })
  }
}
