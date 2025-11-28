import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { calculateDiscount } from '../utils/priceHelper'; // <-- MOTURU BURAYA DA ÇAĞIRDIK

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart();

  if (!isOpen) return null; 

  const getImageUrl = (url) => {
    if (!url) return '';
    return url.replace('http://192.168.2.104:8000', ''); 
  };

  // Fiyat Hesaplama
  const { originalPrice, finalPrice, hasDiscount } = calculateDiscount(product);

  // Sepete eklerken indirimli fiyatı göndermemiz lazım!
  const handleAddToCart = () => {
      // Ürün objesini olduğu gibi ekle (price orijinal kalacak)
      addToCart(product);
      onClose();
  };

  const modalContent = (
    <div className="animate-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
      
      <div className="animate-modal" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: 'var(--surface-color)', width: '90%', maxWidth: '900px', borderRadius: '16px', padding: '30px', display: 'flex', gap: '40px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', flexWrap: 'wrap', color: 'var(--text-color)', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-light)', zIndex: 1 }}>✕</button>

        <div style={{ flex: 1, minWidth: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={getImageUrl(product.image)} alt={product.name} style={{ width: '100%', borderRadius: '10px', objectFit: 'contain', maxHeight: '400px' }} />
        </div>

        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ marginBottom: '15px', fontSize: '28px' }}>{product.name}</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '25px', lineHeight: '1.6' }}>{product.description ? product.description.substring(0, 200) + '...' : 'Açıklama yok.'}</p>

            {/* FİYAT GÖSTERİMİ */}
            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                {hasDiscount ? (
                    <>
                        <span style={{ textDecoration: 'line-through', color: 'var(--text-light)', fontSize: '20px' }}>
                            {originalPrice.toLocaleString()} TL
                        </span>
                        <span style={{ fontSize: '32px', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                            {finalPrice.toLocaleString()} TL
                        </span>
                    </>
                ) : (
                    <span style={{ fontSize: '32px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                        {originalPrice.toLocaleString()} TL
                    </span>
                )}
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <button className="btn-primary" style={{ flex: 2, padding: '15px' }} onClick={handleAddToCart}>
                    SEPETE EKLE
                </button>
                <Link to={`/product/${product.id}`} style={{ flex: 1 }}>
                    <button style={{ width: '100%', height: '100%', padding: '15px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
                        DETAY
                    </button>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
}