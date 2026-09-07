import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import { prismaMock, resetPrismaMock, adminKullanici } from "./helpers";

vi.mock("../lib/prisma", () => ({ prisma: prismaMock }));

const { default: app } = await import("../app");
const { signToken } = await import("../utils/jwt");

beforeEach(() => {
  resetPrismaMock();
});

describe("Hata cevaplarinin bicimi", () => {
  it("saglik kontrolu calisiyor", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("tanimsiz adres HTML degil JSON 404 doner", async () => {
    const res = await request(app).get("/api/boyle-bir-sey-yok");

    expect(res.status).toBe(404);
    // Onceden Express'in varsayilan HTML sayfasi donuyordu ve
    // istemcideki response.json() "Unexpected token <" ile patliyordu.
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body.error).toEqual(expect.any(String));
  });

  it("bozuk JSON govdesi 400 doner", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send("{ bu gecerli json degil");

    expect(res.status).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("kaldirilan /api/about endpoint'i artik yok", async () => {
    const res = await request(app).get("/api/about");
    expect(res.status).toBe(404);
  });

  it("beklenmeyen hatada ic ayrintilar govdede tasinmaz", async () => {
    prismaMock.user.findUnique.mockResolvedValue(adminKullanici);
    prismaMock.post.create.mockRejectedValue(
      new Error("baglanti dizesi: postgres://kullanici:sifre@sunucu"),
    );

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${signToken(adminKullanici.id)}`)
      .send({ title: "Baslik", slug: "baslik", content: "Icerik" });

    expect(res.status).toBe(500);
    // Genel mesaj her ortamda ayni; ayrintili "message" alani
    // yalnizca gelistirmede eklenir ve testte de oyle davranir.
    expect(res.body.error).toBe("Sunucuda beklenmeyen bir hata oluştu");
    expect(JSON.stringify(res.body)).not.toContain("sifre@sunucu");
  });

  it("guvenlik basliklari gonderiliyor (helmet)", async () => {
    const res = await request(app).get("/api/health");

    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    // helmet Express'in "bu bir Express uygulamasi" imzasini kaldirir.
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});
