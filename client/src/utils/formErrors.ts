import { ApiError } from "../services/api";

// SUNUCU HATASINI FORMUN ANLAYACAGI SEKLE CEVIRIR.
//
// Backend dogrulama hatalarini alan bazinda donuyor:
//   { error: "slug ...", details: { slug: ["..."], title: ["..."] } }
//
// Onceden arayuz yalnizca "error" metnini formun tepesine
// basiyordu: kullanici "bir yer yanlis" bilgisini aliyor ama
// HANGI kutunun yanlis oldugunu bulmak icin tahmin yurutuyordu.
//
// Bu fonksiyon iki bilgiyi ayirir:
//   summary -> formun tepesindeki genel mesaj
//   fields  -> her kutunun altina yazilacak mesajlar
export type FormErrors = {
  summary: string;
  fields: Record<string, string[]>;
};

export function toFormErrors(err: unknown): FormErrors {
  if (err instanceof ApiError) {
    // 409: benzersizlik cakismasi. Sunucunun genel mesaji
    // ("Bu kayıt zaten mevcut") teknik olarak dogru ama
    // kullaniciya ne yapacagini soylemiyor.
    if (err.status === 409) {
      return {
        summary: "Bu slug zaten kullanılıyor. Farklı bir tane dene.",
        fields: { slug: ["Bu slug başka bir kayıtta kullanılıyor."] },
      };
    }

    // 0 = ag hatasi (api.ts bu kodu kullaniyor).
    if (err.status === 0) {
      return { summary: err.message, fields: {} };
    }

    return {
      summary: err.message,
      // "_" alanina ait olmayan, govdenin tamamiyla ilgili
      // hatalari da ozete birakiyoruz; kutulara dagitilamaz.
      fields: err.details ?? {},
    };
  }

  return { summary: "Kaydedilemedi.", fields: {} };
}

// Bos bir hata durumu. Form gonderilmeden once ve her yeni
// denemede state'i bununla sifirliyoruz.
export const NO_FORM_ERRORS: FormErrors = { summary: "", fields: {} };
