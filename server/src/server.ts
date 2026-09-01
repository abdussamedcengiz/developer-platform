import 'dotenv/config'   // .env dosyasini okuyup process.env'e yukler
import app from './app'

// process.env'den gelen her sey METINDIR. Number() ile sayiya ceviriyoruz.
const PORT = Number(process.env.PORT) || 4000

// listen() = "bu portu dinlemeye basla".
// Bu satir calistiginda program BITMEZ; istek beklemeye devam eder.
app.listen(PORT, () => {
  console.log(`Server calisiyor -> http://localhost:${PORT}`)
})
