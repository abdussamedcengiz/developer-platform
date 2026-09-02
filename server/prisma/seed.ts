import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// SEED = database'i baslangic verisiyle doldurma.
// Neden gerekli? Projeyi baska bir makineye kurdugunda ya da
// canliya deploy ettiginde database BOS gelir. Her seferinde
// elle veri girmek yerine bu dosyayi calistirirsin.
//
// Calistirmak icin: npx prisma db seed

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL tanimli degil.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

// GitHub profilinden alinan gercek projeler.
// TODO: aciklamalari kendi cumlelerinle zenginlestir --
// her projede HANGI PROBLEMI cozdugunu yazmak en etkilisi.
const projects = [
  {
    title: "Developer Platform",
    slug: "developer-platform",
    description:
      "Bu site. React + TypeScript arayüz, Express + Prisma API, PostgreSQL veritabanı. Blog, proje yönetimi, JWT kimlik doğrulama ve admin paneli içeriyor; sıfırdan yazıldı.",
    githubUrl: "https://github.com/abdussamedcengiz/developer-platform",
    demoUrl: null,
    imageUrl: null,
    featured: true,
  },
  {
    title: "Full-Stack AI Projesi",
    slug: "fullstack-ai-projesi",
    description:
      "TypeScript ile geliştirilen, yapay zekâ servislerini bir web arayüzüne bağlayan full-stack uygulama.",
    githubUrl: "https://github.com/abdussamedcengiz/FullStackAI-Projesi",
    demoUrl: null,
    imageUrl: null,
    featured: true,
  },
  {
    title: "Fast Food App",
    slug: "fast-food-app",
    description:
      "React Native ile yazılmış mobil sipariş uygulaması ve Laravel ile geliştirilen REST API'si. Mobil istemci ile backend'in aynı projede uçtan uca kurgulandığı bir çalışma.",
    githubUrl: "https://github.com/abdussamedcengiz/fast_food_app",
    demoUrl: null,
    imageUrl: null,
    featured: true,
  },
  {
    title: "Todo App",
    slug: "todo-app",
    description:
      "TypeScript ile ayrı frontend ve backend olarak yazılmış görev yönetimi uygulaması. İstemci–sunucu ayrımı ve REST API tasarımı üzerine bir alıştırma.",
    githubUrl: "https://github.com/abdussamedcengiz/todo-app-frontend",
    demoUrl: null,
    imageUrl: null,
    featured: false,
  },
  {
    title: "myCourses — React Native",
    slug: "mycourses-react-native",
    description:
      "Ders takip uygulamasının React Native sürümü. Navigasyon, liste yönetimi ve yerel veri saklama üzerine odaklanıyor.",
    githubUrl: "https://github.com/abdussamedcengiz/ReactNative-myCourses",
    demoUrl: null,
    imageUrl: null,
    featured: false,
  },
  {
    title: "Node.js Blog App",
    slug: "nodejs-blog-app",
    description:
      "Node.js ve EJS şablon motoruyla yazılmış, sunucu tarafında render edilen blog uygulaması. Server-side rendering ile SPA arasındaki farkı görmek için iyi bir karşılaştırma.",
    githubUrl: "https://github.com/abdussamedcengiz/Node.js_Blogapp",
    demoUrl: null,
    imageUrl: null,
    featured: false,
  },
  {
    title: "Depo ve Stok Takip Sistemi",
    slug: "depo-stok-takip",
    description:
      "Kişisel proje: stok ve depo takibi yapan, güvenli kimlik doğrulama içeren uygulama.",
    // TODO: GitHub'da repo varsa adresini ekle
    githubUrl: null,
    demoUrl: null,
    imageUrl: null,
    featured: false,
  },
  {
    title: "Template Matching",
    slug: "template-matching",
    description:
      "Görüntü işleme çalışması: bir görüntü içinde verilen şablonun konumunu bulan template matching uygulaması.",
    githubUrl: "https://github.com/abdussamedcengiz/Template_Matching",
    demoUrl: null,
    imageUrl: null,
    featured: false,
  },
];

async function main() {
  console.log("Seed basliyor...");

  // --- ADMIN KULLANICISI ---
  const email = "cengizabdussamed17@gmail.com";
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    console.log(
      "! SEED_ADMIN_PASSWORD tanimli degil, kullanici olusturulmadi.\n" +
        "  Olusturmak icin: SEED_ADMIN_PASSWORD=... npx prisma db seed",
    );
  } else {
    // upsert = varsa guncelle, yoksa olustur.
    // Seed'i iki kez calistirinca "e-posta zaten var" hatasi almamak icin.
    // Buna "idempotent" denir: kac kez calistirirsan calistir sonuc ayni.
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: "Abdüssamed Cengiz",
        password: await bcrypt.hash(password, 10),
      },
    });
    console.log(`+ Kullanici hazir: ${email}`);
  }

  // --- PROJELER ---
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project, // varsa aciklamayi guncelle
      create: project,
    });
    console.log(`+ Proje: ${project.title}`);
  }

  console.log("Seed tamamlandi.");
}

main()
  .catch((error) => {
    console.error(error);
    // Cikis kodu 0 disinda olursa "npx prisma db seed" HATA verir.
    // Bu onemli: CI/CD icinde sessizce basarisiz olmasin.
    process.exit(1);
  })
  .finally(async () => {
    // Baglantiyi kapat, yoksa script bitmez ve terminal asili kalir.
    await prisma.$disconnect();
  });
