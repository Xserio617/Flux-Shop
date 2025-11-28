import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCarousel from './ProductCarousel';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import { calculateDiscount } from '../utils/priceHelper';
import { API_URL } from '../utils/api';
import axios from 'axios';

export default function CartPage() {
  const { cart, removeFromCart, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Toplam Tutarı Hesaplama (İndirimle)
  const subTotal = cart.reduce((total, item) => {
    const { finalPrice } = calculateDiscount(item);
    return total + (parseFloat(finalPrice) * item.quantity);
  }, 0);

  // İndirim Tutarı Hesaplama (Limitörlü) - Context'ten al
  let discountAmount = (subTotal * appliedCoupon.discountRate) / 100;
  
  if (appliedCoupon.maxDiscountAmount && discountAmount > appliedCoupon.maxDiscountAmount) {
      discountAmount = parseFloat(appliedCoupon.maxDiscountAmount);
  }

  const totalPrice = subTotal - discountAmount;

  const handleApplyCoupon = async () => {
      if (!couponCode) return;
      setCouponError('');
      setCouponSuccess('');
      
      try {
          // Sepet tutarını da gönderiyoruz
          const response = await axios.post(`${API_URL}/coupons/validate/`, { 
              code: couponCode,
              cart_total: subTotal 
          });
          
          console.log('Kupon API Yanıtı:', response.data);
          
          const discountPercentage = parseInt(response.data.discount_percentage) || 0;
          const maxDiscount = response.data.max_discount_amount ? parseFloat(response.data.max_discount_amount) : null;
          
          // Context'e kaydet (Checkout'ta da erişilebilir olacak)
          applyCoupon(couponCode, discountPercentage, maxDiscount);
          
          // Başarı mesajı
          if (maxDiscount) {
              setCouponSuccess(`%${discountPercentage} indirim uygulandı! (Maksimum ${maxDiscount} TL)`);
          } else {
              setCouponSuccess(`%${discountPercentage} indirim uygulandı!`);
          }

      } catch (error) {
          console.error('Kupon Hatası:', error);
          removeCoupon();
          setCouponError(error.response?.data?.error || 'Kupon geçersiz.');
      }
  };

  return (
    // Arka plan rengini değişkene bağladık
    <div style={{ minHeight: '80vh', paddingBottom: '50px', backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      
      <div style={{ padding: '40px 10%' }}>
        <h1 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>Sepetim ({cart.length} Ürün)</h1>

        {/* --- DURUM 1: SEPET BOŞSA --- */}
        {cart.length === 0 ? (
          <div style={{ 
              backgroundColor: 'var(--surface-color)', // <-- KART RENGİ
              padding: '40px', 
              borderRadius: '10px', 
              textAlign: 'center', 
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)'
          }}>
            <h2 style={{ color: 'var(--text-color)' }}>Sepetinde ürün bulunmamaktadır.</h2>
            <p style={{ color: 'var(--text-light)', margin: '10px 0 20px' }}>Hemen alışverişe başlayıp fırsatları yakalayabilirsin!</p>
            <Link to="/">
                <button className="btn-primary">ALIŞVERİŞE BAŞLA</button>
            </Link>
          </div>
        ) : (
            
        /* --- DURUM 2: SEPET DOLUYSA --- */
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* Sol: Ürün Listesi */}
            <div style={{ flex: 2, minWidth: '300px' }}>
                {cart.map(item => {
                    const imageUrl = item.image.startsWith('http') ? item.image : `${API_URL.replace('/api', '')}${item.image}`;

                    return (
                        <div key={item.id} style={{ 
                            display: 'flex', 
                            backgroundColor: 'var(--surface-color)', // <-- KART RENGİ
                            padding: '15px', 
                            marginBottom: '15px', 
                            borderRadius: '8px', 
                            alignItems: 'center', 
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <img src={imageUrl} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', marginRight: '20px' }} />
                            
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, color: 'var(--text-color)' }}>{item.name}</h4>
                                <span style={{ fontSize: '14px', color: 'var(--text-light)' }}>Adet: {item.quantity}</span>
                                {(() => {
                                  const { originalPrice, finalPrice, hasDiscount } = calculateDiscount(item);
                                  return hasDiscount ? (
                                    <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '5px' }}>
                                      <span style={{ textDecoration: 'line-through' }}>{originalPrice.toLocaleString()} TL</span>
                                      {' → '}
                                      <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{finalPrice.toLocaleString()} TL</span>
                                    </div>
                                  ) : null;
                                })()}
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '18px' }}>
                                    {(() => {
                                      const { finalPrice } = calculateDiscount(item);
                                      return (parseFloat(finalPrice) * item.quantity).toFixed(2);
                                    })()} TL
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', marginTop: '5px', textDecoration: 'underline' }}
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Sağ: Sipariş Özeti */}
            <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ 
                    backgroundColor: 'var(--surface-color)', // <-- KART RENGİ
                    padding: '20px', 
                    borderRadius: '8px', 
                    position: 'sticky', 
                    top: '100px', 
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', color: 'var(--text-color)' }}>Sipariş Özeti</h3>
                    
                    {/* Kupon Alanı */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'stretch' }}>
                            <input 
                                type="text" 
                                placeholder="Kupon Kodu" 
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                style={{ 
                                    flex: 1, 
                                    padding: '12px', 
                                    borderTopLeftRadius: '5px',
                                    borderBottomLeftRadius: '5px',
                                    border: '1px solid var(--border-color)',
                                    borderRight: 'none',
                                    backgroundColor: 'var(--background-color)',
                                    color: 'var(--text-color)',
                                    outline: 'none'
                                }}
                            />
                            <button 
                                onClick={handleApplyCoupon}
                                style={{ 
                                    padding: '0 20px', 
                                    backgroundColor: '#6C63FF', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderTopRightRadius: '5px',
                                    borderBottomRightRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                ONAYLA
                            </button>
                        </div>
                        {couponError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>{couponError}</p>}
                        {couponSuccess && <p style={{ color: '#22c55e', fontSize: '12px', marginTop: '5px' }}>{couponSuccess}</p>}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--text-light)' }}>
                        <span>Ara Toplam:</span>
                        <span>{subTotal.toFixed(2)} TL</span>
                    </div>
                    
                    {appliedCoupon.discountRate > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#22c55e' }}>
                            <span>İndirim (%{appliedCoupon.discountRate}):</span>
                            <span>-{discountAmount.toFixed(2)} TL</span>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '18px', fontWeight: 'bold', color: 'var(--text-color)' }}>
                        <span>Toplam:</span>
                        <span style={{ color: 'var(--primary-color)' }}>{totalPrice.toFixed(2)} TL</span>
                    </div>

                    <Link to="/checkout">
                        <button className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '15px' }}>
                            SEPETİ ONAYLA ›
                        </button>
                    </Link>
                </div>
            </div>

          </div>
        )}

      </div>

      {/* Alt Kısım */}
      <div style={{ marginTop: '20px' }}>
                <ProductCarousel />
                <PersonalizedRecommendations />
      </div>

    </div>
  );
}