import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; 
import { toast } from 'react-toastify'; // <-- TOAST İMPORTU

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const { isLoggedIn } = useAuth(); 

  // 1. Favorileri Çekme
  const fetchFavorites = async () => {
    if (!isLoggedIn) {
        setFavorites([]);
        return;
    }
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/favorites/', {
        headers: { Authorization: `Bearer ${token}` } 
      });
      setFavorites(response.data);
    } catch (error) {
      console.error("Favoriler çekilemedi:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isLoggedIn]);

  // 2. Favori Ekleme / Çıkarma (Toggle)
  const toggleFavorite = async (product) => {
    // GİRİŞ KONTROLÜ (Toast ile)
    if (!isLoggedIn) {
        toast.warn("Favorilere eklemek için lütfen giriş yapın! 🔒", {
            position: "top-center",
            autoClose: 3000,
        });
        return;
    }

    const token = localStorage.getItem('accessToken');
    const existingFav = favorites.find(fav => fav.product === product.id);

    try {
      if (existingFav) {
        // --- SİLME İŞLEMİ ---
        await axios.delete(`/api/favorites/${existingFav.id}/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(prev => prev.filter(item => item.id !== existingFav.id));
        
        // BİLDİRİM: SİLİNDİ
        toast.info("Ürün favorilerden çıkarıldı. 💔", {
            autoClose: 1500,
            theme: "light"
        });

      } else {
        // --- EKLEME İŞLEMİ ---
        const response = await axios.post('/api/favorites/', 
            { product: product.id }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites(prev => [...prev, response.data]);

        // BİLDİRİM: EKLENDİ
        toast.success("Ürün favorilere eklendi! ❤️", {
            autoClose: 2000,
            theme: "colored" // Renkli (Yeşil) görünsün
        });
      }
    } catch (error) {
      console.error("Favori işlemi hatası:", error);
      toast.error("Bir hata oluştu, lütfen tekrar dene.");
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.product === productId);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorite() {
  return useContext(FavoriteContext);
}