import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <div className="mx-auto max-w-sm">
      <h1 className="text-3xl font-bold tracking-tight">Giriş</h1>

      {error && <p className="mt-6 alert-error">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            className="form-input"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
