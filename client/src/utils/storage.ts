// GUVENLI localStorage ERISIMI
//
// localStorage her zaman kullanilabilir DEGILDIR:
//   - Safari'nin gizli sekmesinde kota 0'dir, setItem hata firlatir.
//   - Tarayici ayarlarindan site verileri engellenmis olabilir.
//   - Bazi kurumsal politikalar erisimi tamamen kapatir.
//
// Bu durumlarda localStorage'a DOKUNMAK bile hata firlatir. Onceden
// ThemeContext ve AuthContext bunu sarmalamadan cagiriyordu; hata
// React'in ilk render'inda olustugu icin sonuc beyaz ekrandi --
// site sadece tema tercihi okunamadigi icin tamamen aciliyordu.
//
// Buradaki sarmalayici basit bir soz verir: DEPOLAMA CALISMIYORSA
// uygulama calismaya DEVAM EDER, sadece hatirlamaz.
//
// index.html'deki FOUC onleme script'i de ayni sebeple try/catch
// kullaniyor; oradaki koruma zaten vardi, React tarafinda yoktu.

export const safeStorage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Kaydedemedik. Kullanici acisindan tek sonuc: sekmeyi
      // kapatinca tercihi/oturumu unutuluyor. Uygulamayi
      // durdurmaya deger bir sey degil.
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Yukaridakiyle ayni gerekce.
    }
  },

  // JSON okumak iki ayri sekilde basarisiz olabilir: depolama
  // erisilemez, ya da icerideki metin bozuk (elle degistirilmis
  // olabilir). Ikisini de burada yutuyoruz.
  getJSON<T>(key: string): T | null {
    const raw = this.get(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
};
