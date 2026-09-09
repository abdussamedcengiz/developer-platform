import { TOKEN_KEY } from "../constants";
import { safeStorage } from "../utils/storage";

// API'nin adresi ORTAMA gore degisir:
//
//   Gelistirme  -> bos string. fetch("/api/posts") ayni origin'e gider,
//                  Vite proxy'si onu localhost:4000'e iletir.
//   Canli       -> "https://xxx.onrender.com". Proxy yok, tam adres sart.
//
// import.meta.env: Vite'in ortam degiskeni nesnesi.
// Node'daki process.env'in tarayici karsiligi.
// SADECE "VITE_" ile baslayan degiskenler buraya gelir --
// yoksa sunucudaki gizli anahtarlar tarayiciya sizardi.
const API_BASE = import.meta.env.VITE_API_URL ?? "";

// SESSIZ HATAYA KARSI UYARI
//
// Canli build'de VITE_API_URL unutulursa API_BASE bos kalir ve
// her istek arayuzun kendi adresine gider -- orada API yok, hepsi
// 404 doner. Sayfa "yuklenemedi" der ama NEDENINI soylemez;
// bu hatayi aramak saatler alabilir.
//
// import.meta.env.PROD: Vite'in production build isareti.
// Gelistirmede uyari cikmaz, cunku orada bos deger DOGRU olan.
if (import.meta.env.PROD && !API_BASE) {
  console.error(
    "[api] VITE_API_URL tanimli degil. Canli build'de API adresi " +
      "paketin icine gomulur; Render'da bu degiskeni ayarlayip " +
      "arayuzu YENIDEN deploy etmelisin.",
  );
}

// TEK GIRIS NOKTASI
// Hicbir component dogrudan fetch cagirmaz. Her istekte tekrarlanan
// isler (token, Content-Type, hata kontrolu) burada bir kez yazilir.

export class ApiError extends Error {
  status: number;

  // Sunucunun alan bazinda dondurdugu dogrulama hatalari:
  //   { "slug": ["slug yalnizca kucuk harf..."] }
  // Form sayfalari bunu ilgili kutunun altinda gosterebilir.
  details?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// OTURUM SONU BILDIRIMI
//
// Sorun: token 7 gun gecerli. Suresi dolunca arayuz bunu
// ANLAMIYORDU -- elinde bir token vardi, kendini "giris yapmis"
// sayiyor, admin sayfasini aciyor, her istek 401 donuyordu.
// Kullanici cikip tekrar girmeyi denemedikce kilitli kaliyordu.
//
// Bu dosya bir component degil; useAuth cagiramaz, yonlendirme
// yapamaz. Bu yuzden sadece HABER VERIYOR: AuthContext bu olayi
// dinleyip oturumu temizliyor.
//
// CustomEvent yerine basit bir dinleyici listesi: tarayici olay
// sistemine bagimli olmadan ayni isi goruyor ve test edilmesi kolay.
type UnauthorizedListener = () => void;
const unauthorizedListeners = new Set<UnauthorizedListener>();

export function onUnauthorized(listener: UnauthorizedListener) {
  unauthorizedListeners.add(listener);

  // Abonelikten cikma fonksiyonu doner: useEffect'in temizleme
  // adiminda dogrudan kullanilabilir.
  return () => {
    unauthorizedListeners.delete(listener);
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Token'i localStorage'dan okuyoruz, context'ten DEGIL.
  // Bu dosya bir component degil -- hook cagiramaz.
  const token = safeStorage.get(TOKEN_KEY);

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    // fetch YALNIZCA ag seviyesinde bir sorun varsa reddeder:
    // internet yok, sunucu uyuyor, DNS cozulemedi.
    // 404/500 gibi cevaplar buraya DUSMEZ, asagida ele aliniyor.
    //
    // 0 status'u "cevap hic gelmedi" anlaminda kullaniyoruz;
    // cagiran taraf bunu ag hatasi olarak ayirt edebilir.
    throw new ApiError(
      "Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.",
      0,
    );
  }

  // 204 No Content: govde YOK. response.json() cagirirsan patlar.
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Oturum gecersiz: token varken 401 aldiysak token artik
    // ise yaramiyor demektir. Token YOKKEN gelen 401 normaldir
    // (korumasiz bir sayfadan korumali bir istek atilmistir),
    // o durumda kimseyi uyandirmiyoruz.
    if (response.status === 401 && token) {
      for (const listener of unauthorizedListeners) {
        listener();
      }
    }

    throw new ApiError(
      data?.error ?? "Bir hata oluştu",
      response.status,
      data?.details,
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
