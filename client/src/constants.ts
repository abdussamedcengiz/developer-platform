// localStorage anahtarlari.
// Hem AuthContext hem api.ts kullaniyor.
//
// Neden ayri bir dosya? Onceden bunlar AuthContext'te tanimliydi ve
// api.ts oradan import ediyordu. Ama AuthContext de api'yi kullanmaya
// baslayinca DAIRESEL IMPORT olusurdu (A -> B -> A).
// Ortak bir yere tasimak bu dugumu cozer.

export const TOKEN_KEY = "dp_token";
export const USER_KEY = "dp_user";

// index.html'deki FOUC onleme script'i de AYNI anahtari kullaniyor.
// Birini degistirirsen digerini de degistir.
export const THEME_KEY = "dp_theme";
