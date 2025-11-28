import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'

// TÜM HAFIZA (CONTEXT) IMPORTLARI BURADA OLMALI
import { CartProvider } from './context/CartContext' 
import { AuthProvider } from './context/AuthContext' 
import { FavoriteProvider } from './context/FavoriteContext'
import { ThemeProvider } from './context/ThemeContext' // <-- İŞTE EKSİK OLAN BUYDU!

// Google OAuth Client ID - Google Cloud Console'dan alınacak
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {/* Tüm siteyi bu hafızalarla sarıyoruz */}
        <AuthProvider>
          <CartProvider>
            <FavoriteProvider>
              <ThemeProvider> {/* <-- Tema Sağlayıcı */}
                  <App />
              </ThemeProvider>
            </FavoriteProvider>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)