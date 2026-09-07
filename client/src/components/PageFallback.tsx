import Container from "./Container";

// TEMBEL YUKLENEN SAYFALAR ICIN BEKLEME EKRANI.
//
// Suspense bir sayfa indirilirken bunu gosterir. Genellikle
// birkac yuz milisaniye surer -- ama yavas baglantida saniyeler
// alabilir ve o sure boyunca bos beyaz bir alan "site bozuldu"
// gibi gorunur.
//
// Iskelet kutular sayfanin GELMEKTE oldugunu anlatir ve gelecek
// icerigin kabaca seklini verir; ani bir sicrama olmaz.
function PageFallback() {
  return (
    <Container>
      {/* role="status": ekran okuyucu "yukleniyor" bilgisini
          kullaniciya duyurur. Gorsel iskelet tek basina
          gormeyen kullaniciya hicbir sey anlatmaz. */}
      <div role="status" aria-label="Sayfa yükleniyor" className="animate-fade-in">
        <div className="skeleton h-9 w-56" />
        <div className="skeleton mt-4 h-4 w-72" />

        <div className="mt-10 space-y-3">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    </Container>
  );
}

export default PageFallback;
