import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { TOKEN_KEY, USER_KEY } from "../constants";
import { api } from "../services/api";
import type { AuthUser, AuthResponse } from "../types/auth";

// Context'in ICINDE ne olacagini tarif eden tip.
// Bunu okuyan biri "useAuth() bana ne veriyor?" sorusunun
// cevabini bir bakista gorur.
type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
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
    localStorage.getItem(TOKEN_KEY),
  );

  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;

    // localStorage bozuk veri icerebilir (elle degistirilmis olabilir).
    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  });

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

    // 2) localStorage'a yaz -> sayfa yenilenince oturum kaybolmaz
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: token !== null,
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
