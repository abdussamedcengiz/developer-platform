-- Yetkilendirme icin rol sutunu.
--
-- Guvenli varsayilan: mevcut TUM kullanicilar 'USER' olur, yani
-- icerige yazma yetkileri YOKTUR. Yonetici yetkisi ayrica verilir:
--
--   SEED_ADMIN_PASSWORD=... npx prisma db seed
--
-- Bu migration'in ardindan seed CALISTIRILMAZSA yonetici hesabi
-- giris yapabilir ama yazi/proje kaydedemez (403 alir).

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
