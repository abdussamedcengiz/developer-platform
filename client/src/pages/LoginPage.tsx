import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Container from "../components/Container";

function LoginPage() {
  // CONTROLLED INPUTS: kutularin degeri DOM'da degil, state'te tutulur.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ProtectedRoute buraya yonlendirirken nereden geldigimizi state'e koydu.
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? "/admin";

  async function handleSubmit(e: FormEvent) {
    // Formun varsayilan davranisi sayfayi YENIDEN YUKLEMEK.
    // React uygulamasinda bu tum state'i sifirlar.
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await login(email, password);

      // replace: true -> gecmiste /login birakmaz.
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş yapılamadı");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size="sm" className="py-8">
      <div className="animate-fade-up">
        <div className="text-center">
          <div
            aria-hidden="true"
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            AC
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight">
            Yönetim paneli
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Bu alan siteyi yöneten kişiye ait. Devam etmek için giriş yap.
          </p>
        </div>

        <div className="card mt-8 p-6">
          {/* role="alert": hata mesaji ekrana gelince ekran okuyucu
              onu ANINDA duyurur. Kullanici odakta olmasa bile duyar. */}
          {error && (
            <p role="alert" className="alert-error mb-5">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              {/* htmlFor + id eslesir: etikete tiklayinca kutu odaklanir */}
              <label htmlFor="email" className="form-label">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                // autoFocus: bu sayfanin TEK isi giris yapmak.
                // Kullaniciya bir Tab tusu tasarrufu.
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@eposta.com"
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                // Tarayicinin sifre yoneticisi bu attribute'a bakar.
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  {/* Donen halka: butonun beklendigini gosterir.
                      Sadece metin degistirmek yeterince belirgin degil. */}
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}

export default LoginPage;
