// Backend'in /api/auth/login ve /register'dan dondugu kullanici.
// DIKKAT: password YOK -- backend onu omit ile ayikliyor.
// Backend'deki Prisma "Role" enum'unun arayuz karsiligi.
export type Role = "USER" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;

  // Yetki seviyesi. Arayuz bunu yalnizca yonetici baglantilarini
  // gostermek/gizlemek icin kullanir; gercek kontrol backend'de.
  role: Role;

  createdAt: string;
  updatedAt: string;
};

// Iki endpoint de ayni sekli donuyor.
export type AuthResponse = {
  user: AuthUser;
  token: string;
};
