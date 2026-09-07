import type { Role } from "../generated/prisma/client";

// DECLARATION MERGING
// Express'in Request tipine kendi alanimizi ekliyoruz.
// TypeScript ayni isimli interface'leri birlestirir; boylece
// "Request" tipi hem Express'in alanlarini hem bizimkini icerir.

declare global {
  namespace Express {
    interface Request {
      // requireAuth / optionalAuth middleware'leri doldurur.
      //
      // Onceden burada yalnizca "userId" vardi. Rol eklenince
      // ikisini ayri alanlarda tutmak yerine tek bir nesnede
      // topladik: "kullanici var ama rolu yok" gibi imkansiz bir
      // durum artik tipte de temsil edilemiyor.
      //
      // "?" cunku middleware calismadan once bu alan YOK.
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}

// Bu dosyanin bir MODUL sayilmasi icin gerekli.
// Olmazsa "declare global" calismaz.
export {};
