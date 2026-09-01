import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // PROXY: Tarayicida "/api/..." ile baslayan her istek,
    // Vite tarafindan sessizce http://localhost:4000 adresine iletilir.
    // Boylece frontend kodunda tam adres yazmana gerek kalmaz:
    //   fetch('/api/health')  ->  http://localhost:4000/api/health
    // Ayrica tarayici acisindan istek ayni origin'e gittigi icin CORS sorunu cikmaz.
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
