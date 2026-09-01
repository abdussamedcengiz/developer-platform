import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import * as authService from "../services/authService";

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "email ve password zorunludur" });
    return;
  }

  // En temel sifre kurali. Gercek dogrulamayi Asama 16'da zod ile yapacagiz.
  if (password.length < 6) {
    res.status(400).json({ error: "Şifre en az 6 karakter olmalı" });
    return;
  }

  try {
    const result = await authService.registerUser(email, password);

    // 201 = yeni kaynak olusturuldu.
    res.status(201).json(result);
  } catch (error) {
    // P2002 = unique kisiti ihlali -> bu e-posta zaten kayitli.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({ error: "Bu e-posta zaten kayıtlı" });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Kayıt sırasında bir hata oluştu" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "email ve password zorunludur" });
    return;
  }

  try {
    const result = await authService.loginUser(email, password);

    // null = ya kullanici yok ya sifre yanlis.
    // Hangisi oldugunu SOYLEMIYORUZ: saldirgan hangi e-postalarin
    // kayitli oldugunu ogrenmesin (user enumeration).
    if (!result) {
      res.status(401).json({ error: "E-posta veya şifre hatalı" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Giriş sırasında bir hata oluştu" });
  }
}
