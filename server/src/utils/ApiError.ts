// BEKLENEN HATALAR ICIN TEK TIP.
//
// Onceden her controller kendi hata cevabini yaziyordu:
//   res.status(404).json({ error: "..." })
// Ayni kalip 15 yerde tekrar ediyordu ve bicimi bozmak kolaydi
// (biri "error", digeri "message" yazsa istemci fark edemezdi).
//
// Artik controller sadece "bu istek 404" der ve hatayi FIRLATIR;
// cevabin nasil yazilacagina merkezi hata isleyici karar verir.
export class ApiError extends Error {
  status: number;

  // Dogrulama hatalarinda hangi alanin neden reddedildigi.
  // Arayuz bunu alan bazinda gosterebilir.
  details?: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }

  static badRequest(message: string, details?: Record<string, string[]>) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = "Giriş yapmalısınız") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Bu işlem için yetkiniz yok") {
    return new ApiError(403, message);
  }

  static notFound(message: string) {
    return new ApiError(404, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }
}
