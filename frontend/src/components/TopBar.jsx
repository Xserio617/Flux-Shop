import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TopBar() {
    const [config, setConfig] = useState({
        isActive: false,
        image: null, // Görsel URL'si
        link: null
    });
    const [loading, setLoading] = useState(true);

    const getImageUrl = (url) => {
        if (!url) return '';
        // Güvensiz IP'yi söküyoruz
        return url.replace('http://10.127.47.123:8000', ''); 
    };

    useEffect(() => {
        // API çağrısı: Sadece görsel ve link verilerini çekiyoruz
        axios.get('/api/settings/') 
            .then(response => {
                const data = response.data;
                setConfig({
                    isActive: data.is_active,
                    image: data.topbar_image,
                    link: data.topbar_link
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Duyuru çekilemedi:", error);
                setLoading(false);
            });
    }, []);

    // Görüntüleme koşulu: Yükleniyor VEYA aktif değil VEYA görsel yüklenmemişse hiçbir şey gösterme.
    if (loading || !config.isActive || !config.image) {
        return null;
    }
    
    // Tıklama işlevi
    const handleClick = () => {
        if (config.link) {
            window.open(config.link, '_blank');
        }
    };

    // Yüksekliği 64px, arkaplanı şeffaf stil (Görselin kendi renkleri kullanılır)
    const topBarStyle = {
        backgroundColor: 'transparent', 
        padding: '0',
        textAlign: 'center',
        width: '100%',
        height: '64px',
        cursor: config.link ? 'pointer' : 'default',
        overflow: 'hidden',
    };

    return (
        <div style={topBarStyle} onClick={handleClick}>
            <img 
                src={getImageUrl(config.image)} 
                alt="Duyuru Banner" 
                style={{ width: '100%', height: '64px', objectFit: 'cover', display: 'block' }}
            />
        </div>
    );
}