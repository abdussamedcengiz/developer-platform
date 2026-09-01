import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

// Bir sayfayi saran "bekci" component.
// Giris yoksa cocuklarini HIC cizmez, /login'e yonlendirir.
//
// DIKKAT: bu bir GUVENLIK onlemi DEGIL, kullanici deneyimi onlemi.
// Gercek koruma backend'deki requireAuth middleware'inde.
// Tarayicidaki her sey kullanicinin kontrolunde -- localStorage'a
// sahte bir token yazip bu kontrolu gecebilir. Ama API onu reddeder.
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // state: nereden geldigini tasiyoruz ki giris sonrasi
    // kullanici o sayfaya donebilsin.
    // replace: gecmiste korumali adresi birakmiyoruz.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // <>...</> = Fragment. Gereksiz bir <div> eklemeden
  // cocuklari oldugu gibi cizmek icin.
  return <>{children}</>;
}

export default ProtectedRoute;
