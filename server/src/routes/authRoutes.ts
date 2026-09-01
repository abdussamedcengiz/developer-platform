import { Router } from "express";
import * as authController from "../controllers/authController";
import { authLimiter } from "../middlewares/rateLimiter";

const router = Router();

// Giris denemelerine hiz siniri. Kaba kuvvet saldirisina karsi.
router.post("/login", authLimiter, authController.login);

// --- KAYIT: VARSAYILAN OLARAK KAPALI ---
//
// Bu tek kisilik bir portfolyo. Kayit endpoint'i acik kalirsa
// siteyi bulan HERKES hesap acip yazi yayinlayabilir --
// requireAuth "gecerli token" arar, "yetkili kisi" degil.
//
// FEATURE FLAG: kod duruyor ama route yalnizca ortam degiskeni
// acikca "true" ise baglaniyor. Guvenli varsayilan = kapali.
//
// Yeni kullanici olusturmanin normal yolu: prisma/seed.ts
if (process.env.ALLOW_REGISTRATION === "true") {
  router.post("/register", authLimiter, authController.register);
  console.warn(
    "! UYARI: Kayit endpoint'i ACIK (ALLOW_REGISTRATION=true). " +
      "Canlida kapali olmali.",
  );
}

export default router;
