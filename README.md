# Developer Platform

Kişisel developer platformu: portfolyo + blog + admin panel.
Öğrenme amaçlı full-stack proje — hazır tema yok, her katman elle yazıldı.

## Yapı

```
developer-platform/
├── client/       React + TypeScript + Vite + Tailwind 4   (port 5173)
├── server/       Node.js + Express + Prisma + PostgreSQL  (port 4000)
└── render.yaml   Render deployment tanımı (iki servis birden)
```

## Kurulum

```bash
# 1) Backend
cd server
npm install
copy .env.example .env        # Windows (macOS/Linux: cp .env.example .env)
npx prisma migrate dev        # tabloları oluşturur
npm run dev                   # -> http://localhost:4000

# 2) Frontend (YENİ bir terminal penceresinde)
cd client
npm install
npm run dev                   # -> http://localhost:5173
```

Kontrol: tarayıcıda http://localhost:4000/api/health adresini aç.
`{"status":"ok", ...}` görmelisin.

Admin kullanıcısı oluşturmak için:

```bash
cd server
SEED_ADMIN_PASSWORD=secme-bir-sifre npx prisma db seed
```

## Komutlar

| Klasör | Komut | Ne yapar |
|---|---|---|
| server | `npm run dev` | Sunucuyu başlatır, dosya değişince otomatik yeniden başlar |
| server | `npm run build` | `prisma generate` + `prisma migrate deploy` (canlı build adımı) |
| server | `npm start` | Sunucuyu üretim modunda başlatır |
| server | `npm run typecheck` | TypeScript tip hatalarını kontrol eder |
| client | `npm run dev` | Vite dev sunucusunu başlatır |
| client | `npm run build` | Tip kontrolü + production build (`dist/`) |
| client | `npm run lint` | oxlint ile statik analiz |

## Arayüz notları

- **Tasarım jetonları** `client/src/index.css` içindeki `@theme` bloğunda.
  Vurgu rengini değiştirmek için `--color-accent-*` değerlerini değiştirmen yeterli.
- **Tekrar eden kalıplar** (`btn-primary`, `card`, `chip`, `form-input`, `skeleton`)
  aynı dosyada tanımlı. Yeni bir buton stili gerekiyorsa oraya ekle,
  sayfalara dağıtma.
- **Genişlik** sayfa başına `<Container size="sm|md|lg">` ile seçiliyor.
- **Koyu tema** `<html class="dark">` sınıfıyla çalışır; ilk boyama
  `index.html` içindeki küçük script ile React'ten önce yapılır (FOUC önleme).
- **Erişilebilirlik**: atlama bağlantısı, `:focus-visible` halkaları,
  `prefers-reduced-motion` desteği ve ikonlarda `aria-label` mevcut.

---

# Canlıya alma (Neon + Render)

Sıra önemli: **veritabanı → API → arayüz → seed.**
Her adımın sonunda "Kontrol" satırındakini doğrula, sonra devam et.

## 1. Neon — PostgreSQL

1. https://neon.tech adresinde ücretsiz hesap aç.
2. **New Project** → bir isim ver, bölge olarak **Europe (Frankfurt)** seç
   (Render'daki API de Frankfurt'ta olacak; ikisi yakın olsun).
3. Proje açılınca **Connection string** panelinden **Pooled connection**
   adresini kopyala. Şuna benzer:

   ```
   postgresql://KULLANICI:SIFRE@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

   - **Pooled** olanı seç: Render'ın ücretsiz planı uykuya dalıp uyandığında
     bağlantı sayısı dalgalanır; havuzlanmış adres bunu daha iyi karşılar.
   - `sslmode=require` sonda kalsın; Neon şifresiz bağlantı kabul etmez.

**Kontrol:** Neon panelindeki SQL Editor'da `SELECT 1;` çalışıyor mu?

## 2. GitHub

```bash
gh auth login                 # bir kez, tarayıcıdan
gh repo create developer-platform --public --source=. --remote=origin --push
```

**Kontrol:** GitHub'da depo görünüyor ve `render.yaml` içinde.

## 3. Render — Blueprint ile iki servis

Depo kökündeki `render.yaml` her iki servisi de tanımlıyor.

1. https://render.com → GitHub ile giriş yap.
2. **New +** → **Blueprint** → `developer-platform` deposunu seç.
3. Render iki servisi listeler: `developer-platform-api` ve
   `developer-platform-web`. **Apply** de.
4. İstenen değişkenleri gir (aşağıdaki tablo).

### Environment variables

| Servis | Değişken | Değer |
|---|---|---|
| api | `DATABASE_URL` | Neon'dan aldığın pooled adres |
| api | `JWT_SECRET` | Render otomatik üretir — dokunma |
| api | `CLIENT_URL` | Arayüzün adresi, örn. `https://developer-platform-web.onrender.com` |
| web | `VITE_API_URL` | API'nin adresi, örn. `https://developer-platform-api.onrender.com` |

İki servis birbirinin adresini istiyor; bu yüzden sıra şöyle:

1. Önce **api**'yi `DATABASE_URL` ile deploy et. Adresini not al.
2. **web**'e `VITE_API_URL` olarak o adresi gir, deploy et. Adresini not al.
3. **api**'ye dön, `CLIENT_URL` olarak web'in adresini gir → api yeniden deploy olur.

> `VITE_API_URL` **build sırasında** pakete gömülür, çalışma anında okunmaz.
> Değeri sonradan değiştirirsen arayüzü **yeniden deploy etmen** şart.
> Adresin sonuna eğik çizgi koyma.

**Kontrol:**
- `https://...-api.onrender.com/api/health` → `{"status":"ok",...}`
- `https://...-web.onrender.com/projects` → sayfa açılıyor, **yenileyince de**
  açılıyor (rewrite kuralı çalışıyor demektir).
- Tarayıcı konsolunda CORS hatası yok (`CLIENT_URL` doğru demektir).

### Rewrite kuralı nereden geliyor?

İki yerde tanımlı, ikisi de aynı şeyi söylüyor:

- `render.yaml` → `routes: - type: rewrite, source: /*, destination: /index.html`
- `client/public/_redirects` → `/*    /index.html   200`

Blueprint kullanıyorsan birincisi geçerli. Servisi panelden elle kurarsan
ikincisi devreye girer. Bu kural olmadan `/projects` adresini doğrudan açmak
404 verir — çünkü sunucuda öyle bir dosya yok, adresi React Router çözüyor.

## 4. Migration ve seed (production)

`server/npm run build` içinde `prisma migrate deploy` var; **tablolar ilk
deploy'da otomatik oluşur.** Geriye başlangıç verisi kalıyor.

Seed'i **kendi makinenden**, Neon veritabanına bağlanarak çalıştır:

```powershell
cd server
$env:DATABASE_URL="postgresql://...neon.tech/...?sslmode=require"
$env:SEED_ADMIN_PASSWORD="guclu-bir-sifre"
npx prisma db seed

Remove-Item Env:DATABASE_URL, Env:SEED_ADMIN_PASSWORD   # temizle
```

> **Neden Render Shell değil?** Shell sekmesi ücretli planlarda açık;
> free instance'ta yok. Gerek de yok — Neon internete açık olduğu için
> yerelden bağlanmak aynı işi görüyor.
>
> `dotenv` mevcut ortam değişkenlerinin **üzerine yazmaz**, o yüzden
> yukarıdaki `$env:DATABASE_URL` yereldeki `.env` değerini geçersiz kılar
> ve seed doğru veritabanına gider. Bitince temizlemeyi unutma, yoksa
> aynı terminalde çalıştıracağın `npm run dev` de canlı veritabanına bağlanır.

Seed **idempotent**: `upsert` kullanıyor, kaç kez çalıştırırsan çalıştır
aynı sonucu verir, veri çoğaltmaz.

**Kontrol:**
- `https://...-api.onrender.com/api/projects` → proje listesi JSON olarak geliyor.
- Sitede `/login` → seed'de verdiğin şifreyle giriş yapılıyor.

## Notlar

- **Ücretsiz plan uykuya dalar.** 15 dakika istek gelmezse API durur;
  sonraki ilk istek ~30–50 saniye sürer. Sonrası normal hızda.
- **Kayıt endpoint'i kapalı.** `ALLOW_REGISTRATION` canlıda tanımlanmamalı;
  tek kişilik bir site. Kullanıcı oluşturmanın yolu seed.
- **`.env` asla git'e girmez.** Canlı değerler yalnızca Render panelinde durur.

## Yol haritası

- [x] 1. Kurulum + monorepo iskeleti
- [x] 2. Express: route, req/res
- [x] 3. PostgreSQL + Prisma
- [x] 4. Post modeli + migration
- [x] 5. Blog CRUD (backend)
- [x] 6. React Router
- [x] 7. Frontend ↔ Backend bağlantısı
- [x] 8. Authentication (JWT)
- [x] 9. Admin panel + Protected Routes
- [x] 10. Project CRUD
- [ ] 11. Category / Tag / Arama / Pagination *(arama istemci tarafında var)*
- [ ] 12. Comment + Like
- [ ] 13. Dashboard / Analytics
- [x] 14. Portfolio & tasarım
- [ ] 15. React Native
- [ ] 16. Testing + Security
- [x] 17. Deployment + SEO
