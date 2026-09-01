import { Router } from "express";
import * as postController from "../controllers/postController";
import { requireAuth } from "../middlewares/authMiddleware";

// ROUTE KATMANI
// Tek isi: hangi URL + metot hangi fonksiyona gidecek.
// Bu dosyaya bakan biri API'nin tamamini ve NEYIN KORUNDUGUNU
// bir bakista gorebilmeli.
const router = Router();

// --- HERKESE ACIK (okuma) ---
// Blog zaten yayinlanmak icin var; okumak icin giris gerekmez.
router.get("/", postController.listPosts);
router.get("/:slug", postController.getPost);

// --- KORUMALI (yazma) ---
// requireAuth once calisir. next() derse controller'a gecilir,
// demezse istek 401 ile burada biter.
router.post("/", requireAuth, postController.createPost);
router.put("/:slug", requireAuth, postController.updatePost);
router.delete("/:slug", requireAuth, postController.deletePost);

export default router;
