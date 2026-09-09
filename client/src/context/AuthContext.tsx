import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { TOKEN_KEY, USER_KEY } from "../constants";
import { api, onUnauthorized } from "../services/api";
import { safeStorage } from "../utils/storage";
import type { AuthUser, AuthResponse } from "../types/auth";

// Context'in ICINDE ne olacagini tarif eden tip.
// Bunu okuyan biri "useAuth() bana ne veriyor?" sorusunun
// cevabini bir bakista gorur.
type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Baslangic degeri null: Provider olmadan kullanilirsa fark edelim.
const AuthContext = createContext<AuthContextValue | null>(null);

// PROVIDER: veriyi tutan ve agacin altina yayan component.
// children = <AuthProvider> etiketleri arasina koydugun her sey.
export function AuthProvider({ children }: { children: ReactNode }) {
  // useState'e FONKSIYON veriyoruz, deger degil.
  // "Lazy initial state": bu fonksiyon SADECE ilk render'da calisir.
  const [token, setToken] = useState<string | null>(() =>
    safeStorage.get(TOKEN_KEY),
  );

  // safeStorage.getJSON hem depolama erisilemezse hem de icerik
  // bozuksa null doner; iki try/catch'i tek yerde topladik.
  const [user, setUser] = useState<AuthUser | null>(() =>
    safeStorage.getJSON<AuthUser>(USER_KEY),
  );

  // useCallback: logout bir useEffect'in bagimliligi olacak.
  // Her render'da yeni bir fonksiyon uretilseydi effect surekli
  // yeniden kurulurdu.
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    safeStorage.remove(TOKEN_KEY);
    safeStorage.remove(USER_KEY);
  }, []);

  // OTURUM SONU DINLEYICISI
  //
  // api katmani 401 gordugunde haber veriyor. Sebep ne olursa olsun
  // (sure doldu, anahtar degisti, kullanici silindi) elimizdeki
  // token artik ise yaramiyor demektir; temizliyoruz.
  //
  // Bunun gorunur sonucu: ProtectedRoute kullaniciyi /login'e
  // gonderir. Onceden kullanici admin sayfasinda kalir ve her
  // islemde sebepsiz bir hata gorurdu.
  useEffect(() => onUnauthorized(logout), [logout]);

  // ACILISTA OTURUM DOGRULAMA
  //
  // localStorage'daki token'in gecerli olup olmadigini yalnizca
  // sunucu bilir. Acilista bir kez soruyoruz; gecersizse yukaridaki
  // dinleyici devreye girip oturumu temizler.
  //
  // Ayrica kullanici bilgisini tazeliyoruz: rol degismis olabilir.
  useEffect(() => {
    if (!token) return;

    let iptal = false;

    api
      .get<{ user: AuthUser }>("/api/auth/me")
      .then((data) => {
        if (iptal) return;
        setUser(data.user);
        safeStorage.set(USER_KEY, JSON.stringify(data.user));
      })
      .catch(() => {
        // 401 ise onUnauthorized zaten oturumu temizledi.
        // Ag hatasiysa (sunucu uykuda) oturumu DUSURMUYORUZ --
        // kullaniciyi gecici bir baglanti sorunu yuzunden
        // disari atmak yanlis olurdu.
      });

    return () => {
      iptal = true;
    };
    // Yalnizca acilista ve token degistiginde calissin.
  }, [token]);

  async function login(email: string, password: string) {
    // Artik ham fetch degil, api katmani.
    // Adres oneki (canlida Render URL'i) ve hata yonetimi orada.
    const data = await api.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });

    // 1) State'i guncelle -> arayuz aninda tepki verir
    setToken(data.token);
    setUser(data.user);

    // 2) Depolamaya yaz -> sayfa yenilenince oturum kaybolmaz
    safeStorage.set(TOKEN_KEY, data.token);
    safeStorage.set(USER_KEY, JSON.stringify(data.user));
  }

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: token !== null,

    // Arayuz yalnizca yoneticiye ait baglantilari gizlemek icin
    // kullanir. GERCEK kontrol backend'deki requireAdmin'de --
    // buradaki deger kullanicinin degistirebilecegi bir veriden
    // (localStorage) geliyor ve guvenlik icin kullanilamaz.
    isAdmin: user?.role === "ADMIN",

    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// CUSTOM HOOK
// Adi "use" ile baslamak ZORUNDA -- React kurali.
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth, AuthProvider içinde kullanılmalı");
  }

  return context;
}
