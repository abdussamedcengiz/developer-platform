// Backend'in /api/projects'ten dondugu JSON'un TypeScript karsiligi.
// Prisma semasindaki Project modeliyle BIREBIR ayni olmali.

export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;

  // Semada "String?" -> JSON'da anahtar VAR, degeri null olabilir.
  // Bu yuzden "?" degil, "| null".
  imageUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;

  // @default(false) var -> deger her zaman gelir, opsiyonel degil.
  featured: boolean;

  createdAt: string;
  updatedAt: string;
};
