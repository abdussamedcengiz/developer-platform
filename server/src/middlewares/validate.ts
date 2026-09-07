import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/ApiError";

// DOGRULAMA MIDDLEWARE'I
//
// Semayi alir, req.body'yi ona gore dogrular ve DOGRULANMIS
// veriyi req.body'nin yerine koyar.
//
// Yerine koymak onemli: controller artik ham istemci verisini degil,
// semadan gecmis, kirpilmis (trim) ve donusturulmus veriyi gorur.
// Semada olmayan fazladan alanlar da bu sirada dusurulur --
// istemci "role": "ADMIN" gonderse bile controller'a ulasmaz.
export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Hatalari alan adina gore gruplandiriyoruz:
      //   { "email": ["Gecerli bir e-posta girin"], "password": [...] }
      // Arayuz boylece her mesaji ilgili kutunun altina yazabilir.
      const details: Record<string, string[]> = {};

      for (const issue of result.error.issues) {
        // Govdenin kokune ait hata (ornegin "en az bir alan gonderilmeli")
        // bir alana ait degildir; onu "_" altinda topluyoruz.
        const key = issue.path.length > 0 ? issue.path.join(".") : "_";
        (details[key] ??= []).push(issue.message);
      }

      // Ilk mesaji ozet olarak kullaniyoruz: arayuz ayrintiyi
      // gostermek istemezse tek cumlelik anlamli bir metni olur.
      const first = result.error.issues[0]?.message ?? "Geçersiz istek";

      throw ApiError.badRequest(first, details);
    }

    req.body = result.data;
    next();
  };
}
