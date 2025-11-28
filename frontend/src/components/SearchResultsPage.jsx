import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; 
import axios from 'axios';
import ProductCard from './ProductCard';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // URL'deki ?q=karpuz kısmını alır
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40; // 8 satır × 5 sütun = 40 ürün

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1); // Yeni arama için 1. sayfaya dön
    // Backend'e arama isteği atıyoruz: /api/products/?search=karpuz
    axios.get(`/api/products/?search=${query}`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Arama hatası:", err);
        setLoading(false);
      });
  }, [query]); // Her yeni aramada tekrar çalışır

  // Pagination hesaplamaları
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // Sayfa değiştirme
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Sayfanın üstüne kaydır
  };

  return (
    <div style={{ padding: '40px 10%', minHeight: '80vh', backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      
      <h2 style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>
        🔍 "{query}" için arama sonuçları
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-light)' }}>Aranıyor...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-light)' }}>
            <h3>Üzgünüz, aradığınız kriterlere uygun ürün bulunamadı.</h3>
            <p>Farklı anahtar kelimeler deneyebilirsin.</p>
            <Link to="/">
                <button className="btn-primary" style={{marginTop: '20px'}}>Vitrine Dön</button>
            </Link>
        </div>
      ) : (
        <div>
          <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '20px' 
          }}>
              {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
              ))}
          </div>

          {/* PAGİNASYON KONTROLLERI */}
          {products.length > 0 && (
            <div style={{ 
              marginTop: '40px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              {/* Önceki Sayfa Butonu */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 15px',
                  backgroundColor: currentPage === 1 ? 'var(--text-light)' : 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: currentPage === 1 ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage > 1) {
                    e.target.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage > 1) {
                    e.target.style.opacity = '1';
                  }
                }}
              >
                ← Önceki
              </button>

              {/* Sayfa Numaraları - Smart Display - Ortada */}
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {(() => {
                  const pageNumbers = [];
                  const maxDistance = 5;
                  
                  // Her zaman ilk sayfayı göster
                  pageNumbers.push(1);
                  
                  // Eğer currentPage'in başından 5'ten fazla mesafe varsa
                  if (currentPage > maxDistance + 2) {
                    pageNumbers.push('...');
                  }
                  
                  // Mevcut sayfanın etrafındaki sayfaları göster
                  for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
                    if (!pageNumbers.includes(i)) {
                      pageNumbers.push(i);
                    }
                  }
                  
                  // Eğer currentPage'in sonundan 5'ten fazla mesafe varsa
                  if (currentPage < totalPages - maxDistance - 1) {
                    pageNumbers.push('...');
                  }
                  
                  // Her zaman son sayfayı göster
                  if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
                    pageNumbers.push(totalPages);
                  }
                  
                  return pageNumbers.map((pageNum, idx) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${idx}`} style={{ color: 'var(--text-light)', fontSize: '14px', padding: '0 5px', fontWeight: '600' }}>
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: currentPage === pageNum ? 'var(--primary-color)' : 'var(--surface-color)',
                          color: currentPage === pageNum ? 'white' : 'var(--text-color)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: currentPage === pageNum ? '700' : '600',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage !== pageNum) {
                            e.target.style.backgroundColor = 'var(--primary-color)';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentPage !== pageNum) {
                            e.target.style.backgroundColor = 'var(--surface-color)';
                            e.target.style.color = 'var(--text-color)';
                          }
                        }}
                      >
                        {pageNum}
                      </button>
                    )
                  ));
                })()}
              </div>

              {/* Sonraki Sayfa Butonu */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 15px',
                  backgroundColor: currentPage === totalPages ? 'var(--text-light)' : 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentPage < totalPages) {
                    e.target.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage < totalPages) {
                    e.target.style.opacity = '1';
                  }
                }}
              >
                Sonraki →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}