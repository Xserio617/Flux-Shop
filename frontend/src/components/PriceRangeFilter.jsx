import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; 

export default function PriceRangeFilter({ minLimit, maxLimit, onPriceChange }) {
  const [range, setRange] = useState([minLimit, maxLimit]);

  // Kaydırma bittiğinde çalışır
  const handleAfterChange = (value) => {
    onPriceChange(value[0], value[1]); 
  };

  // Kaydırırken çalışır
  const handleChange = (value) => {
    setRange(value);
  };

  return (
    <div style={{ 
        padding: '20px', 
        backgroundColor: 'var(--surface-color)', 
        borderRadius: '12px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-color)',
        width: '100%',
        maxWidth: '400px' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontWeight: '600', color: 'var(--text-color)' }}>
        <span>Fiyat Aralığı:</span>
        <span style={{ color: 'var(--primary-color)' }}>
            {range[0].toLocaleString()} TL - {range[1].toLocaleString()} TL
        </span>
      </div>

      <Slider
        range
        min={minLimit}
        max={maxLimit}
        defaultValue={[minLimit, maxLimit]}
        value={range}
        onChange={handleChange}
        // !!! DÜZELTME BURADA: onAfterChange YERİNE onChangeComplete !!!
        onChangeComplete={handleAfterChange} 
        
        // Stil Ayarları
        trackStyle={[{ backgroundColor: 'var(--primary-color)', height: 6 }]} 
        handleStyle={[
            { borderColor: 'var(--primary-color)', backgroundColor: 'white', opacity: 1, height: 20, width: 20, marginTop: -7 }, 
            { borderColor: 'var(--primary-color)', backgroundColor: 'white', opacity: 1, height: 20, width: 20, marginTop: -7 } 
        ]}
        railStyle={{ backgroundColor: '#ddd', height: 6 }} 
      />
    </div>
  );
}