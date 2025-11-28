import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Kurduğumuz ikon kütüphanesi

export default function StarInput({ rating, setRating }) {
    const [hover, setHover] = useState(null); // Yıldızın üzerine gelme durumu

    return (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[...Array(5)].map((star, index) => {
                const currentRating = index + 1;
                return (
                    <label key={index}>
                        {/* Tıklayınca puanı günceller */}
                        <input
                            type="radio"
                            name="rating"
                            value={currentRating}
                            onClick={() => setRating(currentRating)}
                            style={{ display: 'none' }} // Radyo butonunu gizle
                            checked={rating === currentRating}
                        />
                        {/* Yıldızın görseli (Seçili veya hover rengi alır) */}
                        <FaStar
                            size={24}
                            color={currentRating <= (hover || rating) ? "#f39c12" : "var(--border-color)"} // Altın Sarısı / Gri
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHover(currentRating)}
                            onMouseLeave={() => setHover(null)}
                        />
                    </label>
                );
            })}
        </div>
    );
}