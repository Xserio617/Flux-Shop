import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from './ProductCard';
import LoadingWave from './LoadingWave';

export default function DiscountCarousel() {
  const [products, setProducts] = useState([]);
  const [promoBanners, setPromoBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ürünleri ve reklam bannerlarını paralel çek
    Promise.all([
      axios.get('/api/products/'),
      axios.get('/api/promo-banners/')
    ])
    .then(([productsRes, bannersRes]) => {
      if (Array.isArray(productsRes.data)) {
        const discounted = productsRes.data.filter(p => p.discount_rate > 0);
        setProducts(discounted);
      }
      if (Array.isArray(bannersRes.data)) {
        setPromoBanners(bannersRes.data);
      }
      setLoading(false);
    })
    .catch(error => {
      console.error("Veri çekme hatası:", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
      return (
        <div style={{ padding: '40px 5%', backgroundColor: 'transparent', textAlign: 'center', minHeight: '300px' }}>
            <h3 style={{ color: 'var(--text-light)', marginBottom: '20px' }}>Fırsat Ürünleri Yükleniyor...</h3>
            <LoadingWave />
        </div>
    );
  }
  
  if (products.length === 0) return null;

  return (
    <div style={{ padding: '20px 5%', backgroundColor: 'transparent' }}>
      
      <h2 style={{ 
          marginBottom: '20px', 
          color: 'var(--accent-color)',
          borderLeft: '5px solid var(--accent-color)', 
          paddingLeft: '10px',
          display: 'flex', alignItems: 'center', gap: '10px'
      }}>
        🔥 Süper Fırsatlar
      </h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map(product => (
          <SwiperSlide key={product.id} style={{ height: 'auto' }}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* REKLAM BANNERLARI - 2 Ürün Kartı Genişliğinde */}
      {promoBanners.length > 0 && (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginTop: '30px'
        }}>
          {promoBanners.map(banner => (
            <a 
              key={banner.id}
              href={banner.link_url || '#'}
              target={banner.link_url ? '_blank' : '_self'}
              rel="noopener noreferrer"
              style={{
                gridColumn: 'span 2', // 2 ürün kartı genişliği
                display: 'block',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: banner.link_url ? 'pointer' : 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <img 
                src={banner.image} 
                alt={banner.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  minHeight: '150px',
                  maxHeight: '250px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}