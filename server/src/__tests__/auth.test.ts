import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import { prismaMock, resetPrismaMock, adminKullanici } from "./helpers";

vi.mock("../lib/prisma", () => ({ prisma: prismaMock }));

const { default: app } = await import("../app");
const { signToken } = await import("../utils/jwt");

const SIFRE = "cok-gizli-sifre";
const kayitliKullanici = {
  id: adminKullanici.id,
  email: "admin@ornek.com",
  name: "Admin",
  role: "ADMIN" as const,
  password: bcrypt.hashSync(SIFRE, 10),
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
};

beforeEach(() => {
  resetPrismaMock();
});

describe("POST /api/auth/login", () => {
  it("dogru bilgilerle token doner ve sifre hash'ini SIZDIRMAZ", async () => {
    prismaMock.user.findUnique.mockResolvedValue(kayitliKullanici);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@ornek.com", password: SIFRE });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).not.toHaveProperty("password");
  });

  it("e-postayi kucuk harfe cevirir — buyuk harfle de giris yapilabilir", async () => {
    prismaMock.user.findUnique.mockResolvedValue(kayitliKullanici);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "  Admin@Ornek.COM  ", password: SIFRE });

    expect(res.status).toBe(200);
    // Sorgu normalize edilmis e-posta ile yapilmali.
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "admin@ornek.com" },
    });
  });

  it("yanlis sifrede 401 doner", async () => {
    prismaMock.user.findUnique.mockResolvedValue(kayitliKullanici);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@ornek.com", password: "yanlis-sifre" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("E-posta veya şifre hatalı");
  });

  it("olmayan kullanici, yanlis sifreyle AYNI cevabi alir", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "yok@ornek.com", password: "herhangi" });

    expect(res.status).toBe(401);
    // Mesaj birebir ayni olmali: farkli olsaydi saldirgan hangi
    // e-postalarin kayitli oldugunu ogrenebilirdi.
    expect(res.body.error).toBe("E-posta veya şifre hatalı");
  });

  it("gecersiz e-posta bicimi 400 doner", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "eposta-degil", password: "herhangi" });

    expect(res.status).toBe(400);
    expect(res.body.details).toHaveProperty("email");
    // Dogrulama gecilmeden veritabanina hic gidilmemeli.
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });
});

describe("POST /api/auth/register", () => {
  it("ALLOW_REGISTRATION kapaliyken endpoint hic yoktur", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "yeni@ornek.com", password: "yeterince-uzun-sifre" });

    // 404: route hic baglanmadi. 403 degil -- var olmayan bir
    // endpoint'in varligini ima etmiyoruz.
    expect(res.status).toBe(404);
  });
});

describe("GET /api/auth/me", () => {
  it("token yoksa 401", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("suresi dolmus/gecersiz token 401 doner", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer bozuk.token.degeri");

    expect(res.status).toBe(401);
  });

  it("gecerli token ile kullaniciyi doner", async () => {
    prismaMock.user.findUnique
      // 1) requireAuth'un id + role sorgusu
      .mockResolvedValueOnce(adminKullanici)
      // 2) controller'in tam kullanici sorgusu
      .mockResolvedValueOnce({
        ...kayitliKullanici,
        password: undefined,
      });

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${signToken(adminKullanici.id)}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("admin@ornek.com");
  });

  it("token gecerli ama kullanici silinmisse 401", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${signToken("silinmis-kullanici")}`);

    expect(res.status).toBe(401);
  });
});
