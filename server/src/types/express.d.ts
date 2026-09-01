// DECLARATION MERGING
// Express'in Request tipine kendi alanimizi ekliyoruz.
// TypeScript ayni isimli interface'leri birlestirir; boylece
// "Request" tipi hem Express'in alanlarini hem bizimkini icerir.

declare global {
  namespace Express {
    interface Request {
      // requireAuth middleware'i dolduruyor.
      // "?" cunku middleware calismadan once bu alan YOK.
      // Tip "string": User.id bir cuid, yani metin.
      userId?: string
    }
  }
}

// Bu dosyanin bir MODUL sayilmasi icin gerekli.
// Olmazsa "declare global" calismaz.
export {}
