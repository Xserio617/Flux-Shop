import React from 'react'
import { Link } from 'react-router-dom'

export default function OrderSuccess() {
  return (
    <div style={{ 
        textAlign: 'center', 
        padding: '100px 20px', 
        backgroundColor: 'var(--background-color)', // <-- KARANLIK ZEMİN
        minHeight: '60vh'
    }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
      <h1 style={{ color: 'var(--secondary-color)' }}>Siparişiniz Alındı!</h1>
      <p style={{ fontSize: '18px', color: 'var(--text-light)', margin: '20px 0' }}>
        Ödemeniz başarıyla gerçekleşti. Bizi tercih ettiğiniz için teşekkürler.
      </p>
      <Link to="/">
        <button className="btn-primary">ANA SAYFAYA DÖN</button>
      </Link>
    </div>
  )
}