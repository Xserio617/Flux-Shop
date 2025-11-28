import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';
import ProductCarousel from './ProductCarousel';
import ReviewsSection from './ReviewsSection'; 
import { useCart } from '../context/CartContext';
import { calculateDiscount } from '../utils/priceHelper'; 
import useViewTracker from '../hooks/useViewTracker';
import PersonalizedRecommendations from './PersonalizedRecommendations';

export default function ProductDetailPage() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart(); 

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}/`) 
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ürün çekme hatası:", err);
        setLoading(false);
      });
    window.scrollTo(0, 0);
  }, [id]);

  // Start tracking view time for this product
  useViewTracker({ productId: id, intervalSeconds: 5 });

  if (loading) return <div style={{textAlign:'center', padding:'50px', color: 'var(--text-color)'}}>Yükleniyor...</div>;
  if (!product) return <div style={{textAlign:'center', padding:'50px', color: 'var(--text-color)'}}>Ürün Bulunamadı</div>;

  // Ürün resimlerini hazırla (ana resim + ekstra resimler)
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [{ image: product.image, alt_text: product.name }]
    : [];

  const currentImage = productImages[selectedImageIndex]?.image || product.image;

  return (
    // ARKA PLAN RENGİ DÜZELTİLDİ
    <div style={{ paddingBottom: '50px', backgroundColor: 'var(--background-color)', minHeight: '100vh' }}>
      
      {/* 1. ÜRÜN DETAY ALANI */}
      <div style={{ 
          display: 'flex', gap: '40px', padding: '40px 10%', flexWrap: 'wrap',
          // KUTU RENGİ VE KENARLIK DÜZELTİLDİ
          backgroundColor: 'var(--surface-color)', 
          borderBottom: '1px solid var(--border-color)',
          color: 'var(--text-color)'
      }}>
        
        {/* Sol: Büyük Resim */}
        <div style={{ flex: 1, minWidth: '300px' }}>
            {/* BÜYÜK RESİM */}
            <img 
              src={currentImage} 
              alt={product.name} 
              style={{ 
                width: '100%', 
                borderRadius: '10px', 
                border: '1px solid var(--border-color)', 
                maxHeight: '500px', 
                objectFit: 'contain',
                backgroundColor: 'white',
                marginBottom: '15px'
              }} 
            />
            
            {/* RESİM KÜÇÜK RESİMLERİ (Thumbnail Gallery) */}
            {productImages.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '5px'
              }}>
                {productImages.map((img, index) => (
                  <img
                    key={index}
                    src={img.image}
                    alt={`Resim ${index + 1}`}
                    onClick={() => setSelectedImageIndex(index)}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      border: selectedImageIndex === index 
                        ? '3px solid var(--primary-color)' 
                        : '2px solid var(--border-color)',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: selectedImageIndex === index ? 1 : 0.6
                    }}
                    onMouseEnter={(e) => {
                      if (selectedImageIndex !== index) {
                        e.target.style.opacity = '0.8';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedImageIndex !== index) {
                        e.target.style.opacity = '0.6';
                      }
                    }}
                  />
                ))}
              </div>
            )}
        </div>

        {/* Sağ: Bilgiler */}
        <div style={{ flex: 1, minWidth: '300px' }}>
            <h1 style={{ fontSize: '32px', color: 'var(--secondary-color)', marginBottom: '10px' }}>{product.name}</h1>
            <p style={{ fontSize: '18px', color: 'var(--text-light)', marginBottom: '20px', lineHeight: '1.6' }}>{product.description}</p>
            
            {(() => {
              const { originalPrice, finalPrice, hasDiscount } = calculateDiscount(product);
              return (
                <div style={{ fontSize: '28px', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {hasDiscount ? (
                    <>
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-light)', fontSize: '20px' }}>
                        {originalPrice.toLocaleString()} TL
                      </span>
                      <span>
                        {finalPrice.toLocaleString()} TL
                      </span>
                      <span style={{ backgroundColor: 'var(--accent-color)', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '14px' }}>
                        -%{product.discount_rate}
                      </span>
                    </>
                  ) : (
                    <span>{originalPrice.toLocaleString()} TL</span>
                  )}
                </div>
              );
            })()}

            <button 
                className="btn-primary" 
                style={{ padding: '15px 40px', fontSize: '18px' }}
                onClick={() => addToCart(product)}
            >
                SEPETE EKLE 🛒
            </button>
        </div>
      </div>

      {/* 2. YORUMLAR BÖLÜMÜ */}
      <div style={{ padding: '0 10%' }}>
        <ReviewsSection productId={id} />
      </div>

      {/* 3. DİĞER ÜRÜNLER */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ textAlign: 'center', color: 'var(--text-color)', marginBottom: '-20px' }}>Bunlara da Bakabilirsiniz</h3>
        <ProductCarousel />
        <PersonalizedRecommendations productId={id} />
      </div>
    </div>
  );
}