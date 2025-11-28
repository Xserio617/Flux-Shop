import React from 'react';

export default function SkeletonCard() {
  return (
    <div style={{
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '15px',
        textAlign: 'center',
        backgroundColor: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    }}>
      
      {/* Resim Yeri (Gri Kutu) */}
      <div className="skeleton" style={{ width: '100%', height: '150px' }}></div>

      {/* Yazı Yerleri */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        {/* Başlık */}
        <div className="skeleton" style={{ width: '80%', height: '20px' }}></div>
        
        {/* Fiyat */}
        <div className="skeleton" style={{ width: '40%', height: '20px' }}></div>

        {/* Buton */}
        <div className="skeleton" style={{ width: '100%', height: '40px', marginTop: '10px' }}></div>
      </div>

    </div>
  );
}