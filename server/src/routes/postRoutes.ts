import { Router } from "express";
import * as postController from "../controllers/postController";
import {
  requireAuth,
  requireAdmin,
  optionalAuth,
} from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validate";
import { createPostSchema, updatePostSchema } from "../validation/schemas";

// ROUTE KATMANI
// Tek isi: hangi URL + metot hangi fonksiyona gidecek.
// Bu dosyaya bakan biri API'nin tamamini ve NEYIN KORUNDUGUNU
// bir bakista gorebilmeli.
const router = Router();

// --- HERKESE ACIK (okuma) ---
// Blog zaten yayinlanmak icin var; okumak icin giris gerekmez.
//
// optionalAuth: giris ZORUNLU degil, ama varsa kim oldugunu bilelim.
// Controller buna bakip taslaklari gosterip gostermeyecegine karar
// verir. Bu middleware olmadan yonetici kendi taslagini goremezdi.
router.get("/", optionalAuth, postController.listPosts);
router.get("/:slug", optionalAuth, postController.getPost);

// --- KORUMALI (yazma) ---
// Zincir sirasi anlamli:
//   requireAuth  -> kimsin?        (kimlik dogrulama)
//   requireAdmin -> yetkin var mi? (yetkilendirme)
//   validateBody -> veri gecerli mi?
// Herhangi biri gecmezse controller'a hic ulasilmaz.
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateBody(createPostSchema),
  postController.createPost,
);
router.put(
  "/:slug",
  requireAuth,
  requireAdmin,
  validateBody(updatePostSchema),
  postController.updatePost,
);
router.delete("/:slug", requireAuth, requireAdmin, postController.deletePost);

export default router;
