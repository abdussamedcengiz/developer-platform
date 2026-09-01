// Backend'in /api/auth/login ve /register'dan dondugu kullanici.
// DIKKAT: password YOK -- backend onu omit ile ayikliyor.
export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
};

// Iki endpoint de ayni sekli donuyor.
export type AuthResponse = {
  user: AuthUser;
  token: string;
};
