import express from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes";
import projectRoutes from "./routes/projectRoutes";
import authRoutes from "./routes/authRoutes";

// Express uygulamasini olusturuyoruz.
// Dikkat: bu dosya sunucuyu BASLATMAZ, sadece uygulamayi TANIMLAR.
const app = express();

// --- MIDDLEWARE'LER ---
// Middleware = her istegin, route'a ulasmadan once ugradigi ara durak.
// Sirasi onemlidir: yukaridan asagiya calisirlar.

// 1) CORS: tarayici, farkli bir port/domain'e istek atmayi varsayilan olarak engeller.
//    Client 5173'te, server 4000'de calisiyor -> farkli "origin" sayilir.
//
// CANLIDA sadece kendi arayuzumuze izin veriyoruz. Aksi halde
// herhangi bir site tarayicidan API'mize istek atabilir.
// Gelistirmede CLIENT_URL tanimsizdir -> "true" gelen origin'i yansitir.
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? true,
  }),
);

// 2) express.json(): gelen istegin govdesindeki (body) JSON metnini
//    JavaScript nesnesine cevirir ve req.body'ye koyar.
//    Bu satir olmasaydi req.body "undefined" olurdu.
app.use(express.json());

// --- SAGLIK KONTROLU ---
// Sunucunun ayakta olup olmadigini anlamak icin.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/about", (req, res) => {
  res.json({
    name: "Cengiz",
    role: "Full-stack developer",
    learning: ["React", "Node.js", "PostgreSQL"],
  });
});

// --- KAYNAK ROUTE'LARI ---
// "/api/posts" ile baslayan her istek postRoutes'a devredilir.
app.use("/api/posts", postRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

export default app;
