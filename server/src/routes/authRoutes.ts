import { Router } from "express";
import * as authController from "../controllers/authController";
import { authLimiter } from "../middlewares/rateLimiter";
import { requireAuth } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../validation/schemas";
import { env } from "../config/env";

const router = Router();

// Giris denemelerine hiz siniri. Kaba kuvvet saldirisina karsi.
router.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  authController.login,
);

// Arayuzun "token'im hala gecerli mi?" diye soracagi adres.
// Sure dolmus bir oturumu istemcinin fark etmesinin tek yolu.
router.get("/me", requireAuth, authController.me);

// --- KAYIT: VARSAYILAN OLARAK KAPALI ---
//
// Bu tek kisilik bir portfolyo. Kayit endpoint'i acik kalirsa
// siteyi bulan HERKES hesap acabilir.
//
// ARTIK TEK SAVUNMA BU DEGIL: kayit olan kullanici USER rolu alir
// ve icerige dokunamaz. Onceden bayrak acilsa herkes yonetici
// olurdu; simdi en kotu ihtimalle ise yaramaz bir hesap acilir.
// Yine de varsayilan kapali kaliyor -- gereksiz hesap gereksizdir.
if (env.ALLOW_REGISTRATION) {
  router.post(
    "/register",
    authLimiter,
    validateBody(registerSchema),
    authController.register,
  );
  console.warn(
    "! UYARI: Kayit endpoint'i ACIK (ALLOW_REGISTRATION=true). " +
      "Canlida kapali olmali.",
  );
}

export default router;
