import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules'; // Navigation eklendi
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation'; // Navigation CSS eklendi

export default function HeroSlider() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Görsel yolu düzeltici
    const getImageUrl = (url) => {
        if (!url) return '';
        // Eğer backend farklı bir IP/porttaysa burayı düzeltmek gerekebilir.
        // Şimdilik doğrudan gelen URL'i kullanıyoruz veya localhost düzeltmesi yapıyoruz.
        // return url.replace('http://localhost:8000', ''); 
        return url;
    };

    useEffect(() => {
        // Sadece aktif kampanyaları çek
        axios.get('/api/campaigns/')
            .then(response => {
                // is_active=True olanları filtrele
                const activeCampaigns = response.data.filter(c => c.is_active);
                setCampaigns(activeCampaigns);
                setLoading(false);
            })
            .catch(error => {
                console.error("Kampanya hatası:", error);
                setLoading(false);
            });
    }, []);
    
    if (loading) return <div style={{height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-color)'}}>Yükleniyor...</div>;
    if (campaigns.length === 0) return null;

    return (
        <div style={{ padding: '20px 0' }}>
            {/* Swiper oklarını MOR yapmak için bu CSS'i ekliyoruz.
                --swiper-navigation-color: Swiper'ın kendi değişkeni.
            */}
            <style>
                {`
                    .swiper-button-next, .swiper-button-prev {
                        color: var(--primary-color) !important;
                        font-weight: bold;
                    }
                `}
            </style>
            <Swiper
                modules={[Autoplay, Pagination, Navigation]} // Navigation modülü eklendi
                spaceBetween={0}
                slidesPerView={1}
                loop={campaigns.length > 1} // 1'den fazla kampanya varsa döngü olsun
                pagination={{ clickable: true }}
                navigation={true} // Okları aktifleştir
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                style={{ height: '450px', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}
            >
                {campaigns.map((slide) => (
                    <SwiperSlide key={slide.id} style={{ position: 'relative' }}>
                        {/* Arka Plan Görseli */}
                        <img 
                            src={getImageUrl(slide.image)} 
                            alt={slide.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        
                        {/* Üzerindeki Yazı Alanı (Gradyan Siyah) */}
                        <div style={{
                            position: 'absolute', bottom: '0', left: '0', right: '0',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                            padding: '40px', color: 'white', textAlign: 'left'
                        }}>
                            <h2 style={{ fontSize: '36px', marginBottom: '10px', fontWeight: '800', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{slide.title}</h2>
                            {slide.link_url && (
                                <button 
                                    onClick={() => window.location.href = slide.link_url}
                                    className="btn-primary"
                                    style={{ padding: '10px 25px', fontSize: '16px' }}
                                >
                                    İncele →
                                </button>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}