import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';
import { useFavorite } from '../context/FavoriteContext';
import HeartToggleIcon from './icons/HeartToggleIcon';
import EyeIcon from './icons/EyeIcon';
import QuickViewModal from './QuickViewModal';
import { calculateDiscount } from '../utils/priceHelper';
import StarRating from './StarRating'; // <-- YILDIZ BİLEŞENİ EKLENDİ

export default function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useFavorite();
  const isLiked = isFavorite(product.id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    toggleFavorite(product);
  };

  const handleQuickView = (e) => {
      e.preventDefault(); 
      setIsModalOpen(true); 
  }

  const imageUrl = product.image ? product.image.replace('http://192.168.2.104:8000', '') : '';

  const { originalPrice, finalPrice, hasDiscount } = calculateDiscount(product);

  return (
    <>
        <QuickViewModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <div className={styles.card} style={{ position: 'relative', overflow: 'hidden' }}>
            
            {/* ETİKETLER */}
            <div className={styles.badgeContainer}>
                {hasDiscount && (
                    <div className={`${styles.badge} ${styles.badgeDiscount}`}>
                        %{product.discount_rate} İNDİRİM
                    </div>
                )}
                {product.is_new && (
                    <div className={`${styles.badge} ${styles.badgeNew}`}>
                        YENİ 🔥
                    </div>
                )}
            </div>

            {/* BUTONLAR (SAĞ ÜST) */}
            <div style={{ position: 'absolute', top: '0', right: '0', margin: '10px', zIndex: 5, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button onClick={handleToggleFavorite} style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
                   <HeartToggleIcon filled={isLiked} size={18} />
                </button>
                <button onClick={handleQuickView} style={{ backgroundColor: 'var(--surface-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
                   <EyeIcon size={20} />
                </button>
            </div>

            {/* KART İÇERİĞİ */}
            <Link to={`/product/${product.id}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'contain', marginTop: '25px' }} />
                <div>
                    <h3>{product.name}</h3>
                    
                    {/* YILDIZ GÖSTERİMİ BURAYA GELDİ */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
                        <StarRating rating={product.average_rating} />
                    </div>

                    {/* FİYAT GÖSTERİMİ */}
                    <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        {hasDiscount ? (
                            <>
                                <span style={{ textDecoration: 'line-through', color: 'var(--text-light)', fontSize: '14px', marginRight: '10px' }}>
                                    {originalPrice.toLocaleString()} TL
                                </span>
                                <span className={styles.price} style={{ color: 'var(--accent-color)', fontSize: '20px' }}>
                                    {finalPrice.toLocaleString()} TL
                                </span>
                            </>
                        ) : (
                            <span className={styles.price}>{originalPrice.toLocaleString()} TL</span>
                        )}
                    </div>

                </div>
            </Link>

            <Link to={`/product/${product.id}`}>
                <button className="btn-primary" style={{ width: '100%', marginTop: '5px', fontSize: '14px' }}>
                    İNCELE →
                </button>
            </Link>
        </div>
    </>
  );
}