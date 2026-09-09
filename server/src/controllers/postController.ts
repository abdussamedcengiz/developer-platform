import type { Request, Response } from "express";
import * as postService from "../services/postService";
import { ApiError } from "../utils/ApiError";
import type {
  CreatePostInput,
  UpdatePostInput,
} from "../validation/schemas";

// CONTROLLER KATMANI
// Gorevi: istegi anlamak, service'i cagirmak, cevabi uretmek.
//
// Iki is BURADAN CIKTI:
//   - Dogrulama  -> validateBody middleware'i (route'ta bagli)
//   - Hata cevabi -> merkezi errorHandler
//
// Bu yuzden try/catch yok: Express 5 reddedilen promise'leri
// kendiliginden hata isleyiciye yonlendirir. Geriye yalnizca
// "hangi veri, kime gorunur" karari kaldi.

// Taslaklari yalnizca yonetici gorebilir.
// optionalAuth req.user'i doldurmus olabilir; dolmadiysa
// istek anonim demektir.
function canSeeDrafts(req: Request): boolean {
  return req.user?.role === "ADMIN";
}

export async function listPosts(req: Request, res: Response) {
  const posts = await postService.getAllPosts({
    includeDrafts: canSeeDrafts(req),
  });

  res.json(posts);
}

// Request<{ slug: string }> -> "bu route'un params'inda slug var" demek.
// Boyle yazmazsak TypeScript req.params.slug'i "string | undefined" sayar.
export async function getPost(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params;

  const post = await postService.getPostBySlug(slug, {
    includeDrafts: canSeeDrafts(req),
  });

  if (!post) {
    throw ApiError.notFound(`"${slug}" slug'lı yazı bulunamadı`);
  }

  res.json(post);
}

export async function createPost(req: Request, res: Response) {
  // Govde validateBody'den gecti: alanlar var, tipleri dogru,
  // fazlaliklar dusuruldu.
  const data = req.body as CreatePostInput;

  // authorId ISTEMCIDEN degil, TOKEN'dan geliyor.
  // requireAuth + requireAdmin bu alani garanti eder; kontrol
  // yine de duruyor cunku route'a middleware eklemeyi unutmak
  // mumkun ve o hata sessizce gecmemeli.
  const authorId = req.user?.id;

  if (!authorId) {
    throw ApiError.unauthorized();
  }

  const newPost = await postService.createPost(data, authorId);

  // 201 = yeni kaynak olusturuldu.
  res.status(201).json(newPost);
}

export async function updatePost(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;
  const data = req.body as UpdatePostInput;

  // Var olmayan bir slug'da Prisma P2025 firlatir; merkezi
  // hata isleyici onu 404'e cevirir. Cakisan slug ise P2002 -> 409.
  const updated = await postService.updatePost(slug, data);

  res.json(updated);
}

export async function deletePost(
  req: Request<{ slug: string }>,
  res: Response,
) {
  const { slug } = req.params;

  await postService.deletePost(slug);

  // 204 = basarili, donecek govde yok.
  res.status(204).send();
}
