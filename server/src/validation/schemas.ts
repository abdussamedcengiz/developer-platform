import { z } from "zod";

// ISTEK GOVDESI SEMALARI
//
// Onceden dogrulama controller'lara dagilmisti ve yalnizca
// "alan bos mu?" sorusunu soruyordu:
//
//   if (!title || !slug || !content) { ... }
//
// Bu kontrol TIPI dogrulamiyordu. Su istek gecerli sayiliyordu:
//   { "title": 12345, "slug": [], "content": {} }
// ve hata, controller'da degil, Prisma'nin icinde 500 olarak patliyordu.
//
// Ayrica uzunluk siniri yoktu: 10 MB'lik bir baslik dogruca
// veritabanina gidiyordu.
//
// Sema tabanli dogrulama bu iki sorunu birden cozer ve
// "gecerli istek nedir?" sorusunun cevabini tek dosyada toplar.

// Slug URL'in bir parcasi olacak: yalnizca kucuk harf, rakam ve tire.
// Bosluk veya Turkce karakter iceren bir slug adres cubugunda
// yuzde kodlamasina donusur ve okunaksiz olur.
const slugSchema = z
  .string()
  .trim()
  .min(1, "slug bos olamaz")
  .max(120, "slug en fazla 120 karakter olabilir")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "slug yalnizca kucuk harf, rakam ve tire icerebilir",
  );

// Bos metin gonderilen opsiyonel alanlari null'a ceviriyoruz.
// Arayuzdeki bos bir <textarea> "" gonderir; veritabaninda
// bunu bos metin olarak saklamak yerine "deger yok" demek dogrusu.
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .optional();

const optionalUrl = z
  .union([z.url("Gecerli bir adres girin"), z.literal("")])
  .transform((value) => (value === "" ? null : value))
  .nullable()
  .optional();

// --- AUTH ---

// E-POSTA: ONCE NORMALIZE, SONRA DOGRULA.
//
// Sira onemli. "z.email().trim()" yazmak ise yaramaz: zod once
// bicimi kontrol eder, bastaki/sondaki bosluklar yuzunden istek
// 400 ile reddedilir ve trim hic calismaz. (Bu tuzagi testler
// yakaladi: bosluklu bir e-posta 200 yerine 400 donuyordu.)
//
// pipe ile once metni temizliyoruz, sonra e-posta semasina veriyoruz.
//
// toLowerCase: "Cengiz@x.com" ile "cengiz@x.com" ayni hesaptir.
// Normalize etmezsek kullanici buyuk harfle yazdiginda giris
// yapamaz -- e-posta yerel kismi teknik olarak buyuk/kucuk harf
// duyarli olsa da pratikte hicbir saglayici bunu ayirt etmez.
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Gecerli bir e-posta girin"));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Sifre zorunludur"),
});

export const registerSchema = z.object({
  email: emailSchema,
  // 8 karakter, 6 degil: 6 karakterlik bir sifre gunumuzde
  // kaba kuvvetle makul surede kirilabilir.
  password: z
    .string()
    .min(8, "Sifre en az 8 karakter olmali")
    .max(200, "Sifre en fazla 200 karakter olabilir"),
  name: z.string().trim().min(1).max(100).optional(),
});

// --- POST ---

export const createPostSchema = z.object({
  title: z.string().trim().min(1, "Baslik zorunludur").max(200),
  slug: slugSchema,
  content: z.string().trim().min(1, "Icerik zorunludur").max(100_000),
  excerpt: optionalText(500),
  published: z.boolean().optional(),
});

// Guncellemede her alan opsiyonel: gonderilmeyen alan degismez.
// .partial() bunu tek satirda yapar -- alanlari elle tekrar
// yazsaydik iki sema zamanla birbirinden ayrisirdi.
//
// refine: tamamen bos bir govde ("{}") anlamsizdir; istemci
// muhtemelen bir hata yapmistir, sessizce basarili donmeyelim.
export const updatePostSchema = createPostSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Guncellenecek en az bir alan gonderilmeli",
  });

// --- PROJECT ---

export const createProjectSchema = z.object({
  title: z.string().trim().min(1, "Baslik zorunludur").max(200),
  slug: slugSchema,
  description: z.string().trim().min(1, "Aciklama zorunludur").max(2_000),
  imageUrl: optionalUrl,
  githubUrl: optionalUrl,
  demoUrl: optionalUrl,
  featured: z.boolean().optional(),
});

export const updateProjectSchema = createProjectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Guncellenecek en az bir alan gonderilmeli",
  });

// Controller'lar bu tipleri kullanir; sema ile kod arasinda
// elle yazilmis ikinci bir tip tanimi olmaz, ikisi ayrisamaz.
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
