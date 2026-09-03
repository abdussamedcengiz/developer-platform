import { TOKEN_KEY } from "../constants";

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

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Token'i localStorage'dan okuyoruz, context'ten DEGIL.
  // Bu dosya bir component degil -- hook cagiramaz.
  const token = localStorage.getItem(TOKEN_KEY);

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // 204 No Content: govde YOK. response.json() cagirirsan patlar.
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.error ?? "Bir hata oluştu", response.status);
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
