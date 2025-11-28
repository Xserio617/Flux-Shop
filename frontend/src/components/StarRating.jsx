import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa'; // NOT: BU KÜTÜPHANEYİ KURACAĞIZ

// Bu, 4.5 gibi bir puanı dolu/boş/yarım yıldıza çeviren bileşendir.

export default function StarRating({ rating, size = 16, color = '#f39c12' }) {
    if (!rating) return null; // Rating yoksa hiçbir şey gösterme

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Tam Yıldızlar
    for (let i = 0; i < fullStars; i++) {
        stars.push(<FaStar key={`full-${i}`} color={color} size={size} />);
    }
    // Yarım Yıldız
    if (hasHalfStar) {
        stars.push(<FaStarHalfAlt key="half" color={color} size={size} />);
    }
    // Boş Yıldızlar
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<FaRegStar key={`empty-${i}`} color={color} size={size} />);
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {stars}
            <span style={{ fontSize: '14px', color: 'var(--text-light)', marginLeft: '4px' }}>
                ({rating.toFixed(1)})
            </span>
        </div>
    );
}