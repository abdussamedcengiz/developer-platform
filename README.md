# Developer Platform

Kişisel developer platformu: portfolyo + blog + admin panel.
Öğrenme amaçlı full-stack proje.

## Yapı

```
developer-platform/
├── client/   React + TypeScript + Vite   (port 5173)
└── server/   Node.js + Express + TS      (port 4000)
```

## Kurulum

```bash
# 1) Backend
cd server
npm install
copy .env.example .env        # Windows (macOS/Linux: cp .env.example .env)
npm run dev                   # -> http://localhost:4000

# 2) Frontend (YENİ bir terminal penceresinde)
cd client
npm install
npm run dev                   # -> http://localhost:5173
```

Kontrol: tarayıcıda http://localhost:4000/api/health adresini aç.
`{"status":"ok", ...}` görmelisin.

## Komutlar

| Klasör | Komut | Ne yapar |
|---|---|---|
| server | `npm run dev` | Sunucuyu başlatır, dosya değişince otomatik yeniden başlar |
| server | `npm run typecheck` | TypeScript tip hatalarını kontrol eder |
| client | `npm run dev` | Vite dev sunucusunu başlatır |
| client | `npm run build` | Production build alır |

## Yol haritası

- [x] 1. Kurulum + monorepo iskeleti
- [ ] 2. Express: route, req/res
- [ ] 3. PostgreSQL + Prisma
- [ ] 4. Post modeli + migration
- [ ] 5. Blog CRUD (backend)
- [ ] 6. React Router
- [ ] 7. Frontend ↔ Backend bağlantısı
- [ ] 8. Authentication (JWT)
- [ ] 9. Admin panel + Protected Routes
- [ ] 10. Project CRUD
- [ ] 11. Category / Tag / Arama / Pagination
- [ ] 12. Comment + Like
- [ ] 13. Dashboard / Analytics
- [ ] 14. Portfolio & tasarım
- [ ] 15. React Native
- [ ] 16. Testing + Security
- [ ] 17. Deployment + SEO
