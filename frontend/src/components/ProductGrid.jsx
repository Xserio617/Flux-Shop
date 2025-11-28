import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import PriceRangeFilter from './PriceRangeFilter'; 
import LoadingWave from './LoadingWave';
import 'animate.css';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Ana kategoriler (children içeriyor)
  const [categoryPath, setCategoryPath] = useState([]); // Seçilen kategori yolu [ana, alt, alt-alt...]
  const [loading, setLoading] = useState(true);
  
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  
  // Sıralama
  const [sortBy, setSortBy] = useState('default');
  const [sortPanelOpen, setSortPanelOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40; // 8 satır × 5 sütun = 40 ürün

  // Kategorileri çek (hiyerarşik yapıda gelecek)
  useEffect(() => {
    axios.get('/api/categories/').then(res => {
        if (Array.isArray(res.data)) setCategories(res.data);
    });
  }, []);

  // Seçili kategorinin alt kategorilerini bul (recursive helper)
  const findCategoryById = (cats, id) => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Mevcut seviyedeki kategorileri belirle
  const getCurrentLevelCategories = () => {
    if (categoryPath.length === 0) {
      return categories; // Ana kategoriler
    }
    const lastSelectedId = categoryPath[categoryPath.length - 1];
    const lastCategory = findCategoryById(categories, lastSelectedId);
    return lastCategory?.children || [];
  };

  const currentLevelCategories = getCurrentLevelCategories();
  const selectedCategoryId = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1] : null;

  // Ürünleri çek (kategori değiştiğinde)
  useEffect(() => {
    setLoading(true);
    let url = '/api/products/?';
    
    // Seçili kategori varsa, o kategori ve alt kategorilerini dahil et
    if (selectedCategoryId) {
      url += `category=${selectedCategoryId}&include_children=true&`;
    }
    
    if (minPrice > 0) url += `min_price=${minPrice}&`;
    if (maxPrice < 500000) url += `max_price=${maxPrice}&`;
    
    // Sıralama parametresi ekle
    if (sortBy !== 'default') {
      let orderingParam = '';
      switch(sortBy) {
        case 'price-low':
          orderingParam = 'price';
          break;
        case 'price-high':
          orderingParam = '-price';
          break;
        case 'rating':
          orderingParam = '-average_rating';
          break;
        case 'popular':
          orderingParam = '-review_count';
          break;
        default:
          orderingParam = '-created_at';
      }
      url += `ordering=${orderingParam}&`;
    }

    setTimeout(() => { 
        axios.get(url)
          .then(res => {
            console.log("API Response:", res.data);
            console.log("Products count:", Array.isArray(res.data) ? res.data.length : 0);
            setProducts(Array.isArray(res.data) ? res.data : []);
            setCurrentPage(1); // Filtre değiştiğinde 1. sayfaya dön
            setLoading(false);
          })
          .catch(err => {
            console.error("Veri çekme hatası:", err);
            console.error("URL:", url);
            setLoading(false);
          });
    }, 500); 

  }, [categoryPath, minPrice, maxPrice, sortBy]);

  // Kategori seçme fonksiyonu
  const handleCategoryClick = (categoryId) => {
    const category = findCategoryById(categories, categoryId);
    
    // Eğer alt kategorisi varsa, path'e ekle
    if (category && category.children && category.children.length > 0) {
      setCategoryPath([...categoryPath, categoryId]);
    } else {
      // Alt kategorisi yoksa, sadece bu kategoriyi seç
      setCategoryPath([...categoryPath, categoryId]);
    }
  };

  // Breadcrumb'dan bir kategoriye tıklama
  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      setCategoryPath([]); // Tümü'ne dön
    } else {
      setCategoryPath(categoryPath.slice(0, index + 1));
    }
  };

  // Geri gitme
  const goBack = () => {
    setCategoryPath(categoryPath.slice(0, -1));
  };

  const handlePriceChange = (min, max) => {
      setMinPrice(min);
      setMaxPrice(max);
  };

  const clearFilters = () => {
      setCategoryPath([]);
      setMinPrice(0);
      setMaxPrice(500000);
      setSortBy('default');
  };

  // Breadcrumb için kategori isimlerini al
  const getBreadcrumbNames = () => {
    return categoryPath.map(id => {
      const cat = findCategoryById(categories, id);
      return cat ? { id: cat.id, name: cat.name } : null;
    }).filter(Boolean);
  };

  const breadcrumbs = getBreadcrumbNames();

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
    <div style={{ padding: '40px 5%' }}>
      
      <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            
            {/* Kategoriler (SOLDA) - Hiyerarşik */}
            <div style={{ flex: 1, minWidth: '300px' }}>
                <h3 style={{ color: 'var(--text-color)', marginBottom: '15px' }}>Kategoriler</h3>
                
                {/* BREADCRUMB NAVİGASYON */}
                {categoryPath.length > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '15px',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      onClick={() => handleBreadcrumbClick(-1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-color)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'var(--background-color)'}
                      onMouseLeave={(e) => e.target.style.background = 'none'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                      </svg>
                      Tümü
                    </button>
                    {breadcrumbs.map((crumb, index) => (
                      <React.Fragment key={crumb.id}>
                        <span style={{ color: 'var(--text-light)' }}>›</span>
                        <button
                          onClick={() => handleBreadcrumbClick(index)}
                          style={{
                            background: index === breadcrumbs.length - 1 ? 'var(--primary-color)' : 'none',
                            border: 'none',
                            color: index === breadcrumbs.length - 1 ? 'white' : 'var(--primary-color)',
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontWeight: index === breadcrumbs.length - 1 ? '600' : '400',
                            transition: 'all 0.2s'
                          }}
                        >
                          {crumb.name}
                        </button>
                      </React.Fragment>
                    ))}
                    
                    {/* Geri Butonu */}
                    <button
                      onClick={goBack}
                      style={{
                        marginLeft: 'auto',
                        background: 'var(--background-color)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-color)',
                        cursor: 'pointer',
                        fontSize: '13px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      ← Geri
                    </button>
                  </div>
                )}
                
                {/* KATEGORİ BUTONLARI */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                    {/* Tümü butonu - sadece ana seviyede göster */}
                    {categoryPath.length === 0 && (
                      <button 
                        onClick={() => setCategoryPath([])} 
                        style={{ 
                          backgroundColor: categoryPath.length === 0 ? 'var(--primary-color)' : 'var(--background-color)', 
                          color: categoryPath.length === 0 ? 'white' : 'var(--text-color)', 
                          border: '1px solid var(--border-color)', 
                          padding: '10px 20px', 
                          borderRadius: '25px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                          Tümü
                      </button>
                    )}
                    
                    {currentLevelCategories.map(cat => (
                        <button 
                          key={cat.id} 
                          onClick={() => handleCategoryClick(cat.id)} 
                          style={{ 
                            backgroundColor: 'var(--background-color)', 
                            color: 'var(--text-color)', 
                            border: '1px solid var(--border-color)', 
                            padding: '10px 20px', 
                            borderRadius: '25px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--primary-color)';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'var(--background-color)';
                            e.target.style.color = 'var(--text-color)';
                          }}
                        >
                            {cat.name}
                            {cat.children && cat.children.length > 0 && (
                              <span style={{ 
                                fontSize: '12px', 
                                opacity: 0.7
                              }}>→</span>
                            )}
                        </button>
                    ))}
                    
                    {/* Alt kategori yoksa mesaj */}
                    {categoryPath.length > 0 && currentLevelCategories.length === 0 && (
                      <div style={{ 
                        color: 'var(--text-light)', 
                        fontSize: '14px',
                        padding: '10px',
                        fontStyle: 'italic'
                      }}>
                        Bu kategoride alt kategori bulunmuyor.
                      </div>
                    )}
                </div>
            </div>

            {/* Fiyat Slider (SAĞA YASLANDI) */}
            <div style={{ 
                flex: 1, 
                minWidth: '300px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end',
                gap: '20px'
            }}>
                {/* Fiyat Filtresi */}
                <div style={{ width: '100%', maxWidth: '350px' }}>
                    <PriceRangeFilter minLimit={0} maxLimit={500000} onPriceChange={handlePriceChange} />
                </div>
                
                {/* Sıralama Dropdown Paneli */}
                <div style={{ 
                    position: 'relative',
                    width: '100%',
                    maxWidth: '350px'
                }}>
                    {/* Sıralama Toggle Butonu */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '10px',
                        textAlign: 'right'
                    }}>
                        <button
                            onClick={() => setSortPanelOpen(!sortPanelOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 14px',
                                fontSize: '13px',
                                fontWeight: '600',
                                border: '1px solid var(--border-color)',
                                backgroundColor: sortPanelOpen ? 'var(--background-color)' : 'transparent',
                                color: 'var(--text-color)',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                                marginLeft: 'auto'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'var(--background-color)';
                            }}
                            onMouseLeave={(e) => {
                                if (!sortPanelOpen) {
                                    e.target.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <span style={{ 
                                transform: sortPanelOpen ? 'rotate(-90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                            }}>
                                ›
                            </span>
                            Sıralama
                        </button>
                    </div>

                    {/* Dropdown Menü */}
                    {sortPanelOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            marginTop: '8px',
                            backgroundColor: 'var(--surface-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-md)',
                            zIndex: '1000',
                            minWidth: '200px',
                            overflow: 'hidden'
                        }}>
                            {/* Varsayılan */}
                            <button
                                onClick={() => {
                                    setSortBy('default');
                                    setCurrentPage(1);
                                    setSortPanelOpen(false);
                                }}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    fontSize: '13px',
                                    fontWeight: sortBy === 'default' ? '600' : '500',
                                    border: 'none',
                                    backgroundColor: sortBy === 'default' ? 'var(--primary-color)' : 'transparent',
                                    color: sortBy === 'default' ? 'white' : 'var(--text-color)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    borderBottom: '1px solid var(--border-color)'
                                }}
                                onMouseEnter={(e) => {
                                    if (sortBy !== 'default') {
                                        e.target.style.backgroundColor = 'var(--background-color)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (sortBy !== 'default') {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                Varsayılan
                            </button>

                            {/* Düşük Fiyat */}
                            <button
                                onClick={() => {
                                    setSortBy('price-low');
                                    setCurrentPage(1);
                                    setSortPanelOpen(false);
                                }}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    fontSize: '13px',
                                    fontWeight: sortBy === 'price-low' ? '600' : '500',
                                    border: 'none',
                                    backgroundColor: sortBy === 'price-low' ? 'var(--primary-color)' : 'transparent',
                                    color: sortBy === 'price-low' ? 'white' : 'var(--text-color)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    borderBottom: '1px solid var(--border-color)'
                                }}
                                onMouseEnter={(e) => {
                                    if (sortBy !== 'price-low') {
                                        e.target.style.backgroundColor = 'var(--background-color)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (sortBy !== 'price-low') {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                💰 Düşük Fiyat
                            </button>

                            {/* Yüksek Fiyat */}
                            <button
                                onClick={() => {
                                    setSortBy('price-high');
                                    setCurrentPage(1);
                                    setSortPanelOpen(false);
                                }}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    fontSize: '13px',
                                    fontWeight: sortBy === 'price-high' ? '600' : '500',
                                    border: 'none',
                                    backgroundColor: sortBy === 'price-high' ? 'var(--primary-color)' : 'transparent',
                                    color: sortBy === 'price-high' ? 'white' : 'var(--text-color)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    borderBottom: '1px solid var(--border-color)'
                                }}
                                onMouseEnter={(e) => {
                                    if (sortBy !== 'price-high') {
                                        e.target.style.backgroundColor = 'var(--background-color)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (sortBy !== 'price-high') {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                💰 Yüksek Fiyat
                            </button>

                            {/* En Yüksek Puan */}
                            <button
                                onClick={() => {
                                    setSortBy('rating');
                                    setCurrentPage(1);
                                    setSortPanelOpen(false);
                                }}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    fontSize: '13px',
                                    fontWeight: sortBy === 'rating' ? '600' : '500',
                                    border: 'none',
                                    backgroundColor: sortBy === 'rating' ? 'var(--primary-color)' : 'transparent',
                                    color: sortBy === 'rating' ? 'white' : 'var(--text-color)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    borderBottom: '1px solid var(--border-color)'
                                }}
                                onMouseEnter={(e) => {
                                    if (sortBy !== 'rating') {
                                        e.target.style.backgroundColor = 'var(--background-color)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (sortBy !== 'rating') {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                ⭐ En Yüksek Puan
                            </button>

                            {/* Popüler */}
                            <button
                                onClick={() => {
                                    setSortBy('popular');
                                    setCurrentPage(1);
                                    setSortPanelOpen(false);
                                }}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    fontSize: '13px',
                                    fontWeight: sortBy === 'popular' ? '600' : '500',
                                    border: 'none',
                                    backgroundColor: sortBy === 'popular' ? 'var(--primary-color)' : 'transparent',
                                    color: sortBy === 'popular' ? 'white' : 'var(--text-color)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (sortBy !== 'popular') {
                                        e.target.style.backgroundColor = 'var(--background-color)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (sortBy !== 'popular') {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                🔥 Popüler
                            </button>
                        </div>
                    )}
                </div>
            </div>

          </div>
      </div>

      {/* ÜRÜN IZGARASI */}
      <h2 style={{ color: 'var(--secondary-color)', marginBottom: '20px' }}>Tüm Ürünler</h2>
      
      {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ color: 'var(--text-light)', marginBottom: '20px' }}>Ürünler Yükleniyor...</h3>
              <LoadingWave />
          </div>
      ) : products.length === 0 ? (
          <div className="animate-entry" style={{textAlign:'center', padding:'50px', color: 'var(--text-color)'}}>
              <h3>Bu kriterlerde ürün bulunamadı.</h3>
              <button onClick={clearFilters} style={{ marginTop: '10px', color: 'var(--primary-color)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>Filtreleri Temizle</button>
          </div>
      ) : (
          <div className="animate__animated animate__fadeIn" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '25px' 
          }}>
            {currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
      )}

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
  );
}