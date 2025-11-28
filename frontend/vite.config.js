import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { 
    // 1. Dışarıya Erişim Ayarı (0.0.0.0)
    host: true, 
    port: 5173, 
    
    // 2. İzin Verilen Hostlar (Ngrok ve Yerel Ağ için)
    allowedHosts: [
        'all',                 // Geliştirme ortamında tüm adreslere izin ver (En rahatı)
        '.ngrok-free.dev',
        'literalistically-unstaved-aaliyah.ngrok-free.dev',     // Ngrok wildcard
        'localhost',
        '127.0.0.1'
    ],
    
    // 3. AKILLI SANTRAL (PROXY)
    // Buradaki numara: Hedefi '127.0.0.1' yaptık.
    // IP adresin değişse bile, sunucu kendi içinde Django'yu her zaman bulur.
    proxy: {
        '/api': {
            target: 'http://127.0.0.1:8000', 
            changeOrigin: true, 
            secure: false,      
        }, 
        '/media': {
            target: 'http://127.0.0.1:8000', 
            changeOrigin: true,
            secure: false,
        }
    }
  }
})