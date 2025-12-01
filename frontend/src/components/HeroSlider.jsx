import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HeroSlider() {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

    // Ekran boyutunu takip et
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Görsel yolu düzeltici
    const getImageUrl = (url) => {
        if (!url) return '';
        return url;
    };

    useEffect(() => {
        axios.get('/api/campaigns/')
            .then(response => {
                const activeCampaigns = response.data.filter(c => c.is_active);
                setCampaigns(activeCampaigns);
                setLoading(false);
            })
            .catch(error => {
                console.error("Kampanya hatası:", error);
                setLoading(false);
            });
    }, []);
    
    if (loading) return (
        <div style={{
            height: isMobile ? '200px' : '400px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            color: 'var(--text-color)'
        }}>
            Yükleniyor...
        </div>
    );
    
    if (campaigns.length === 0) return null;

    return (
        <div style={{ padding: isMobile ? '10px 0' : '20px 0' }}>
            <style>
                {`
                    .swiper-button-next, .swiper-button-prev {
                        color: var(--primary-color) !important;
                        font-weight: bold;
                    }
                    @media (max-width: 600px) {
                        .swiper-button-next, .swiper-button-prev {
                            width: 30px !important;
                            height: 30px !important;
                        }
                        .swiper-button-next::after, .swiper-button-prev::after {
                            font-size: 18px !important;
                        }
                        .swiper-pagination-bullet {
                            width: 8px !important;
                            height: 8px !important;
                        }
                    }
                `}
            </style>
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                loop={campaigns.length > 1}
                pagination={{ clickable: true }}
                navigation={!isMobile} // Mobilde ok butonlarını gizle
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                style={{ 
                    height: isMobile ? '220px' : '450px', 
                    width: '100%', 
                    borderRadius: isMobile ? '12px' : '16px', 
                    overflow: 'hidden', 
                    boxShadow: 'var(--shadow-md)',
                    margin: isMobile ? '0 auto' : undefined,
                    maxWidth: isMobile ? 'calc(100% - 20px)' : undefined,
                    marginLeft: isMobile ? '10px' : undefined,
                    marginRight: isMobile ? '10px' : undefined
                }}
            >
                {campaigns.map((slide) => (
                    <SwiperSlide key={slide.id} style={{ position: 'relative' }}>
                        {/* Arka Plan Görseli */}
                        <img 
                            src={getImageUrl(slide.image)} 
                            alt={slide.title} 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover' 
                            }} 
                        />
                        
                        {/* Üzerindeki Yazı Alanı (Gradyan Siyah) */}
                        <div style={{
                            position: 'absolute', 
                            bottom: '0', 
                            left: '0', 
                            right: '0',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                            padding: isMobile ? '15px' : '40px', 
                            color: 'white', 
                            textAlign: 'left'
                        }}>
                            <h2 style={{ 
                                fontSize: isMobile ? '18px' : '36px', 
                                marginBottom: isMobile ? '8px' : '10px', 
                                fontWeight: '800', 
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                margin: 0,
                                lineHeight: 1.2
                            }}>
                                {slide.title}
                            </h2>
                            {slide.link_url && (
                                <button 
                                    onClick={() => window.location.href = slide.link_url}
                                    className="btn-primary"
                                    style={{ 
                                        padding: isMobile ? '8px 16px' : '10px 25px', 
                                        fontSize: isMobile ? '13px' : '16px',
                                        marginTop: isMobile ? '8px' : '10px'
                                    }}
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