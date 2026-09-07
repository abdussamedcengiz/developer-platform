import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import {
  prismaMock,
  resetPrismaMock,
  yayindakiYazi,
  taslakYazi,
  adminKullanici,
  normalKullanici,
} from "./helpers";

// vi.mock DOSYANIN BASINA TASINIR (hoisting): import'lardan once
// calisir. Bu yuzden app'i normal import edemiyoruz -- import
// edilseydi gercek prisma modulu yuklenmis olurdu.
vi.mock("../lib/prisma", () => ({ prisma: prismaMock }));

const { default: app } = await import("../app");
const { signToken } = await import("../utils/jwt");

const adminToken = signToken(adminKullanici.id);
const userToken = signToken(normalKullanici.id);

// requireAuth kullaniciyi veritabanindan okur; taklit sorguyu
// gonderen token'a gore cevaplayalim.
function girisYapmisOl(kullanici: { id: string; role: "ADMIN" | "USER" }) {
  prismaMock.user.findUnique.mockResolvedValue(kullanici);
}

beforeEach(() => {
  resetPrismaMock();
});

describe("GET /api/posts — taslak gorunurlugu", () => {
  it("anonim ziyaretciye YALNIZCA yayindaki yazilari sorar", async () => {
    prismaMock.post.findMany.mockResolvedValue([yayindakiYazi]);

    const res = await request(app).get("/api/posts");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);

    // Asil sinav: sorguya "published: true" filtresi kondu mu?
    // Bu satir, duzeltilen kritik acigi kalici olarak koruyor.
    expect(prismaMock.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { published: true } }),
    );
  });

  it("gecersiz token tasiyan istek de anonim sayilir", async () => {
    prismaMock.post.findMany.mockResolvedValue([yayindakiYazi]);

    const res = await request(app)
      .get("/api/posts")
      .set("Authorization", "Bearer tamamen-uydurma-token");

    expect(res.status).toBe(200);
    expect(prismaMock.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { published: true } }),
    );
  });

  it("USER rolundeki kullanici da taslaklari goremez", async () => {
    girisYapmisOl(normalKullanici);
    prismaMock.post.findMany.mockResolvedValue([yayindakiYazi]);

    await request(app)
      .get("/api/posts")
      .set("Authorization", `Bearer ${userToken}`);

    expect(prismaMock.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { published: true } }),
    );
  });

  it("ADMIN taslaklari da gorur (filtre uygulanmaz)", async () => {
    girisYapmisOl(adminKullanici);
    prismaMock.post.findMany.mockResolvedValue([yayindakiYazi, taslakYazi]);

    const res = await request(app)
      .get("/api/posts")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(prismaMock.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} }),
    );
  });
});

describe("GET /api/posts/:slug — taslak gorunurlugu", () => {
  it("anonim ziyaretci taslaga eristiginde 404 alir", async () => {
    // Servis "slug + published: true" ile ariyor; taslak eslesmez.
    prismaMock.post.findFirst.mockResolvedValue(null);

    const res = await request(app).get("/api/posts/gizli-taslak");

    expect(res.status).toBe(404);
    expect(prismaMock.post.findFirst).toHaveBeenCalledWith({
      where: { slug: "gizli-taslak", published: true },
    });
  });

  it("ADMIN ayni taslagi gorebilir", async () => {
    girisYapmisOl(adminKullanici);
    prismaMock.post.findFirst.mockResolvedValue(taslakYazi);

    const res = await request(app)
      .get("/api/posts/gizli-taslak")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.slug).toBe("gizli-taslak");
    expect(prismaMock.post.findFirst).toHaveBeenCalledWith({
      where: { slug: "gizli-taslak" },
    });
  });
});

describe("POST /api/posts — yetkilendirme", () => {
  const gecerliGovde = {
    title: "Yeni Yazi",
    slug: "yeni-yazi",
    content: "Icerik.",
  };

  it("token yoksa 401", async () => {
    const res = await request(app).post("/api/posts").send(gecerliGovde);

    expect(res.status).toBe(401);
    expect(prismaMock.post.create).not.toHaveBeenCalled();
  });

  it("USER rolu 403 alir — giris yapmis olmak yetmez", async () => {
    girisYapmisOl(normalKullanici);

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${userToken}`)
      .send(gecerliGovde);

    expect(res.status).toBe(403);
    expect(prismaMock.post.create).not.toHaveBeenCalled();
  });

  it("ADMIN yazi olusturabilir ve authorId token'dan gelir", async () => {
    girisYapmisOl(adminKullanici);
    prismaMock.post.create.mockResolvedValue({ ...yayindakiYazi });

    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${adminToken}`)
      // Istemci baskasinin kimligini gondermeye calisiyor:
      .send({ ...gecerliGovde, authorId: "baska-birisi" });

    expect(res.status).toBe(201);
    expect(prismaMock.post.create).toHaveBeenCalledWith({
      // authorId govdeden DEGIL token'dan alinmali.
      data: expect.objectContaining({ authorId: adminKullanici.id }),
    });
  });
});

describe("POST /api/posts — govde dogrulama", () => {
  beforeEach(() => {
    girisYapmisOl(adminKullanici);
  });

  it("eksik alanlarda 400 doner ve alan bazinda ayrinti verir", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Sadece baslik" });

    expect(res.status).toBe(400);
    expect(res.body.details).toHaveProperty("slug");
    expect(res.body.details).toHaveProperty("content");
  });

  it("yanlis TIPTE alan 500 degil 400 doner", async () => {
    // Eski surumde bu istek dogrulamayi geciyor ve Prisma'nin
    // icinde patlayarak 500 donuyordu.
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: 12345, slug: [], content: {} });

    expect(res.status).toBe(400);
    expect(prismaMock.post.create).not.toHaveBeenCalled();
  });

  it("bicimsiz slug reddedilir", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Baslik", slug: "Gecersiz Slug!", content: "Icerik" });

    expect(res.status).toBe(400);
    expect(res.body.details).toHaveProperty("slug");
  });
});
