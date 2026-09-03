import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// SPA'lerde sayfa degisimi gercek bir sayfa yuklemesi DEGIL --
// tarayici kaydirma konumunu oldugu yerde birakir.
//
// Sonuc: uzun bir blog yazisinin sonundan "Projeler"e gecince
// sayfanin ortasinda aciliyor. Kullanici basligi hic gormuyor.
//
// Bu bilesen hicbir sey cizmez (null doner), sadece yol degisince
// yukari kaydirir. hash (#bolum) varsa dokunmaz -- kullanici
// bilerek bir bolume gitmek istemis demektir.
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;

    // "instant": burada yumusak kaydirma istemiyoruz. Yeni sayfa
    // zaten yeni bir baglam; kaydirma animasyonu gecikme hissi verir.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
