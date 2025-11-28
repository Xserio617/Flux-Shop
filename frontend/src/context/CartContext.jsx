import React, { createContext, useState, useContext } from 'react';
// Havalı bildirimler için kütüphaneyi çağırıyoruz
import { toast } from 'react-toastify'; 

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  
  // Kupon Bilgileri (Checkout sayfasında da kullanılacak)
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: null,
    discountRate: 0,
    maxDiscountAmount: null
  });

  // 1. Sepete Ürün Ekleme
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Ürün zaten varsa miktarını arttır
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Yoksa yeni ekle
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    // !!! ESKİ ALERT YERİNE HAVALI TOAST BİLDİRİMİ !!!
    toast.success(`${product.name} sepete eklendi! 🛒`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
  };

  // 2. Sepetten Ürün Silme
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.info("Ürün sepetten çıkarıldı.", { autoClose: 1500 });
  };

  // 3. Sepeti Komple Sıfırlama (Sipariş Sonrası İçin)
  const clearCart = () => {
    console.log("Sepet temizleniyor..."); 
    setCart([]);
    // Kuponu da sıfırla
    setAppliedCoupon({ code: null, discountRate: 0, maxDiscountAmount: null });
  };

  // 4. Kupon Uygulama
  const applyCoupon = (code, discountRate, maxDiscountAmount = null) => {
    setAppliedCoupon({ code, discountRate, maxDiscountAmount });
  };

  // 5. Kuponu Kaldırma
  const removeCoupon = () => {
    setAppliedCoupon({ code: null, discountRate: 0, maxDiscountAmount: null });
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart,
      appliedCoupon,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Diğer dosyalardan erişim için kanca (hook)
export function useCart() {
  return useContext(CartContext);
}