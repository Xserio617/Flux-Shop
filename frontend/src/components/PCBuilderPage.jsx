import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import styles from './PCBuilderPage.module.css';
import { getComponentIcon } from './icons/pc-builder';

const API_URL = import.meta.env.VITE_API_URL || '';

// Session ID oluştur (misafir kullanıcılar için)
const getSessionId = () => {
  let sessionId = localStorage.getItem('pc_builder_session');
  if (!sessionId) {
    sessionId = 'pcb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('pc_builder_session', sessionId);
  }
  return sessionId;
};

const PCBuilderPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [componentTypes, setComponentTypes] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [components, setComponents] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState({});
  const [build, setBuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingComponents, setLoadingComponents] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [brandFilter, setBrandFilter] = useState('');
  
  const token = localStorage.getItem('accessToken');
  const sessionId = getSessionId();

  // Parça türlerini yükle
  useEffect(() => {
    fetchComponentTypes();
    fetchOrCreateBuild();
  }, []);

  // Aktif adım değiştiğinde parçaları yükle
  useEffect(() => {
    if (componentTypes.length > 0) {
      fetchComponents(componentTypes[activeStep]?.slug);
    }
  }, [activeStep, componentTypes, priceRange, brandFilter]);

  const fetchComponentTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pc-builder/component-types/`);
      setComponentTypes(response.data);
    } catch (error) {
      console.error('Parça türleri yüklenemedi:', error);
    }
  };

  const fetchOrCreateBuild = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const params = !token ? { session_id: sessionId } : {};
      
      // Mevcut build var mı kontrol et
      const response = await axios.get(`${API_URL}/api/pc-builder/builds/`, { headers, params });
      
      if (response.data.length > 0) {
        const existingBuild = response.data[0];
        setBuild(existingBuild);
        
        // Seçili parçaları yükle
        const selected = {};
        existingBuild.build_components?.forEach(bc => {
          const typeSlug = bc.component_details?.component_type;
          if (typeSlug) {
            selected[typeSlug] = bc.component_details;
          }
        });
        setSelectedComponents(selected);
        setTotalPrice(parseFloat(existingBuild.total_price) || 0);
      } else {
        // Yeni build oluştur
        const createResponse = await axios.post(
          `${API_URL}/api/pc-builder/builds/`,
          { name: 'Yeni Bilgisayar', session_id: sessionId },
          { headers }
        );
        setBuild(createResponse.data);
      }
    } catch (error) {
      console.error('Build yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComponents = async (typeSlug) => {
    if (!typeSlug) return;
    
    setLoadingComponents(true);
    try {
      const params = new URLSearchParams();
      params.append('type', typeSlug);
      if (priceRange.min > 0) params.append('min_price', priceRange.min);
      if (priceRange.max < 200000) params.append('max_price', priceRange.max);
      if (brandFilter) params.append('brand', brandFilter);
      
      const response = await axios.get(`${API_URL}/api/pc-builder/components/?${params}`);
      setComponents(response.data);
    } catch (error) {
      console.error('Parçalar yüklenemedi:', error);
    } finally {
      setLoadingComponents(false);
    }
  };

  const selectComponent = async (component) => {
    if (!build) return;
    
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.post(
        `${API_URL}/api/pc-builder/builds/${build.id}/add-component/`,
        { component_id: component.id, session_id: sessionId },
        { headers }
      );
      
      // Seçili parçayı güncelle
      const currentType = componentTypes[activeStep]?.slug;
      setSelectedComponents(prev => ({
        ...prev,
        [currentType]: component
      }));
      
      // Toplam fiyatı güncelle
      calculateTotalPrice({ ...selectedComponents, [currentType]: component });
      
      // Sonraki adıma geç
      if (activeStep < componentTypes.length - 1) {
        setTimeout(() => setActiveStep(activeStep + 1), 500);
      }
    } catch (error) {
      console.error('Parça eklenemedi:', error);
    }
  };

  const removeComponent = async (typeSlug) => {
    if (!build || !selectedComponents[typeSlug]) return;
    
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const componentId = selectedComponents[typeSlug].id;
      
      await axios.delete(
        `${API_URL}/api/pc-builder/builds/${build.id}/remove-component/${componentId}/?session_id=${sessionId}`,
        { headers }
      );
      
      const newSelected = { ...selectedComponents };
      delete newSelected[typeSlug];
      setSelectedComponents(newSelected);
      calculateTotalPrice(newSelected);
    } catch (error) {
      console.error('Parça kaldırılamadı:', error);
    }
  };

  const calculateTotalPrice = (selected) => {
    const total = Object.values(selected).reduce((sum, comp) => {
      return sum + (parseFloat(comp?.price) || 0);
    }, 0);
    setTotalPrice(total);
  };

  const addAllToCart = async () => {
    if (!build || Object.keys(selectedComponents).length === 0) {
      toast.warning('Lütfen en az bir parça seçin!');
      return;
    }
    
    try {
      // Seçili tüm parçaları sepete ekle
      Object.values(selectedComponents).forEach(component => {
        if (component.product) {
          addToCart({
            id: component.product,
            name: `${component.brand} ${component.model_name}`,
            price: component.price,
            image: component.image,
            quantity: 1
          });
        }
      });
      
      toast.success('Tüm parçalar sepete eklendi! 🎉');
      navigate('/cart');
    } catch (error) {
      console.error('Sepete eklenemedi:', error);
      toast.error('Sepete eklerken bir hata oluştu.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Benzersiz markalar
  const uniqueBrands = [...new Set(components.map(c => c.brand))].filter(Boolean);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>PC Builder yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>
          <span className={styles.highlight}>🖥️ BİLGİSAYAR</span> TOPLA
        </h1>
        <p>Hayalindeki bilgisayarı birkaç adımda topla, fiyatını anında gör!</p>
      </div>

      {/* Progress Steps */}
      <div className={styles.stepsContainer}>
        {componentTypes.map((type, index) => (
          <div 
            key={type.id}
            className={`${styles.step} ${index === activeStep ? styles.activeStep : ''} ${selectedComponents[type.slug] ? styles.completedStep : ''}`}
            onClick={() => setActiveStep(index)}
          >
            <div className={styles.stepIcon}>
              {getComponentIcon(type.icon || type.slug, 20)}
            </div>
            <span className={styles.stepName}>{type.name}</span>
            {selectedComponents[type.slug] && <span className={styles.stepCheck}>✓</span>}
          </div>
        ))}
      </div>

      <div className={styles.mainContent}>
        {/* Sol Panel - Parça Seçimi */}
        <div className={styles.selectionPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelHeaderIcon}>
              {getComponentIcon(componentTypes[activeStep]?.icon || componentTypes[activeStep]?.slug, 28, "white")}
            </div>
            <h2>
              ADIM {activeStep + 1}: {componentTypes[activeStep]?.name?.toUpperCase()} SEÇ
            </h2>
            
            {/* Filtreler */}
            <div className={styles.filters}>
              <select 
                value={brandFilter} 
                onChange={(e) => setBrandFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">🏷️ Tüm Markalar</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              
              <div className={styles.priceFilter}>
                <span>💰 Bütçe: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}</span>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className={styles.rangeSlider}
                />
              </div>
            </div>
          </div>

          {/* Parça Listesi */}
          <div className={styles.componentGrid}>
            {loadingComponents ? (
              <div className={styles.loadingComponents}>
                <div className={styles.spinner}></div>
              </div>
            ) : components.length === 0 ? (
              <div className={styles.noComponents}>
                <p>🔍 Bu kategoride parça bulunamadı.</p>
                <small>Admin panelinden PC parçaları ekleyebilirsiniz.</small>
              </div>
            ) : (
              components.map(component => (
                <div 
                  key={component.id}
                  className={`${styles.componentCard} ${selectedComponents[componentTypes[activeStep]?.slug]?.id === component.id ? styles.selectedCard : ''}`}
                  onClick={() => selectComponent(component)}
                >
                  <div className={styles.componentImage}>
                    {component.image ? (
                      <img src={component.image.startsWith('http') ? component.image : `${API_URL}${component.image}`} alt={component.product_name} />
                    ) : (
                      <div className={styles.noImage}>📦</div>
                    )}
                  </div>
                  <div className={styles.componentInfo}>
                    <h4>{component.brand}</h4>
                    <p>{component.model_name}</p>
                    <div className={styles.specs}>
                      {Object.entries(component.specifications || {}).slice(0, 3).map(([key, value]) => (
                        <span key={key} className={styles.spec}>
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                    <div className={styles.price}>
                      {formatPrice(component.price)}
                    </div>
                  </div>
                  {selectedComponents[componentTypes[activeStep]?.slug]?.id === component.id && (
                    <div className={styles.selectedBadge}>✓ Seçildi</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sağ Panel - Özet */}
        <div className={styles.summaryPanel}>
          <h3>🛠️ Yapılandırman</h3>
          
          <div className={styles.selectedList}>
            {componentTypes.map(type => {
              const selected = selectedComponents[type.slug];
              return (
                <div key={type.id} className={`${styles.selectedItem} ${selected ? styles.selectedItemActive : ''}`}>
                  <div className={styles.selectedType}>
                    <span className={styles.selectedTypeIcon}>
                      {getComponentIcon(type.icon || type.slug, 16)}
                    </span>
                    {type.name}
                    {type.is_required && <span className={styles.required}>*</span>}
                  </div>
                  {selected ? (
                    <div className={styles.selectedDetails}>
                      <span>{selected.brand} {selected.model_name}</span>
                      <span className={styles.selectedPrice}>{formatPrice(selected.price)}</span>
                      <button 
                        className={styles.removeBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeComponent(type.slug);
                        }}
                        title="Kaldır"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className={styles.notSelected}>— Seçilmedi</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.totalSection}>
            <div className={styles.totalRow}>
              <span>Toplam Tutar</span>
              <span className={styles.totalPrice}>{formatPrice(totalPrice)}</span>
            </div>
            <div className={styles.installment}>
              💳 12 aya varan taksit imkanı
            </div>
          </div>

          <button 
            className={styles.addToCartBtn}
            onClick={addAllToCart}
            disabled={Object.keys(selectedComponents).length === 0}
          >
            🛒 TÜMÜNÜ SEPETE EKLE
          </button>

          <div className={styles.navigationBtns}>
            <button 
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className={styles.navBtn}
            >
              ← Önceki
            </button>
            <button 
              onClick={() => setActiveStep(Math.min(componentTypes.length - 1, activeStep + 1))}
              disabled={activeStep === componentTypes.length - 1}
              className={styles.navBtn}
            >
              Sonraki →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCBuilderPage;
