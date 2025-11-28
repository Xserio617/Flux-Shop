import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './CargoTracking.module.css';
import { toast } from 'react-toastify';

export default function CargoTrackingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // URL'den gelen sipariş numarasını al
  useEffect(() => {
    const orderNumber = searchParams.get('order');
    if (orderNumber) {
      setTrackingId(orderNumber);
      searchOrder(orderNumber);
    }
  }, [searchParams]);

  const searchOrder = async (orderNumber) => {
    setLoading(true);
    setSearched(true);
    setOrder(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error("Lütfen giriş yapın!");
        navigate('/login');
        return;
      }

      // Kullanıcının siparişlerini getir
      const response = await fetch('/api/orders/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Siparişler alınamadı');
      
      const orders = await response.json();
      
      // Girilen sipariş numarasını bul
      const foundOrder = orders.find(o => 
        o.order_number.toLowerCase() === orderNumber.toLowerCase()
      );

      if (foundOrder) {
        setOrder(foundOrder);
        toast.success("Sipariş bilgileri bulundu! 📦");
      } else {
        toast.error("Bu sipariş numarası bulunamadı!");
      }
    } catch (error) {
      console.error('Sipariş arama hatası:', error);
      toast.error("Sipariş aranırken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.warn("Lütfen bir sipariş numarası girin!");
      return;
    }
    searchOrder(trackingId.trim());
  };

  // Sipariş durumuna göre adım indeksi
  const getStatusStep = (status) => {
    const statusMap = {
      'pending': 0,
      'processing': 1,
      'shipped': 2,
      'delivered': 3,
      'cancelled': -1,
    };
    return statusMap[status] ?? 0;
  };

  // Tarih formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Dinamik adımlar oluştur (sipariş tarihine göre)
  const getSteps = (order) => {
    if (!order) return [];
    
    const orderDate = new Date(order.created_at);
    const day1 = new Date(orderDate);
    const day2 = new Date(orderDate);
    day2.setDate(day2.getDate() + 1);
    const day3 = new Date(orderDate);
    day3.setDate(day3.getDate() + 2);
    const day4 = new Date(orderDate);
    day4.setDate(day4.getDate() + 3);

    return [
      { 
        title: "Sipariş Alındı", 
        desc: "Siparişiniz onaylandı ve hazırlanıyor.", 
        time: formatDate(orderDate)
      },
      { 
        title: "Hazırlanıyor", 
        desc: "Siparişiniz depoda hazırlanıyor.", 
        time: formatDate(day1)
      },
      { 
        title: "Kargoya Verildi", 
        desc: "Paketiniz kargo firmasına teslim edildi.", 
        time: formatDate(day2)
      },
      { 
        title: "Teslim Edildi", 
        desc: "Paketiniz başarıyla teslim edildi.", 
        time: order.status === 'delivered' ? formatDate(day3) : "-"
      },
    ];
  };

  const statusStep = order ? getStatusStep(order.status) : -1;
  const steps = getSteps(order);

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--secondary-color)' }}>
        🚚 Kargo Takip
      </h1>

      {/* Arama Kutusu */}
      <div className={styles.searchBox}>
        <p>Sipariş numaranızı girin (Örn: SIP-123456)</p>
        <form onSubmit={handleSearch} className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="Örn: SIP-123456" 
            className={styles.input}
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Aranıyor...' : 'Sorgula'}
          </button>
        </form>
      </div>

      {/* İptal Edilmiş Sipariş */}
      {order && order.status === 'cancelled' && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '20px',
          marginTop: '30px',
          textAlign: 'center',
        }}>
          <h3 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>❌ Sipariş İptal Edildi</h3>
          <p style={{ margin: 0, color: '#991b1b' }}>
            Bu sipariş iptal edilmiştir. Detaylar için müşteri hizmetleri ile iletişime geçin.
          </p>
        </div>
      )}

      {/* Sipariş Bulunamadı */}
      {searched && !loading && !order && (
        <div style={{
          backgroundColor: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '30px',
          marginTop: '30px',
          textAlign: 'center',
        }}>
          <h3 style={{ color: 'var(--text-color)', margin: '0 0 10px 0' }}>
            🔍 Sipariş Bulunamadı
          </h3>
          <p style={{ margin: 0, color: 'var(--text-light)' }}>
            Girdiğiniz sipariş numarası sistemde bulunamadı. 
            Lütfen doğru numarayı girdiğinizden emin olun.
          </p>
          <button
            onClick={() => navigate('/orders')}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Siparişlerime Git
          </button>
        </div>
      )}

      {/* Sipariş Bilgileri */}
      {order && order.status !== 'cancelled' && (
        <div style={{
          backgroundColor: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '20px',
          marginTop: '30px',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: 'var(--text-color)' }}>
                Sipariş #{order.order_number}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-light)' }}>
                Sipariş Tarihi: {formatDate(order.created_at)}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-light)' }}>
                Toplam Tutar
              </p>
              <p style={{ 
                margin: 0, 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: 'var(--primary-color)' 
              }}>
                {order.total_price} TL
              </p>
            </div>
          </div>

          {/* Teslimat Adresi */}
          <div style={{
            backgroundColor: 'var(--background-color)',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}>
            <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: 'var(--text-light)' }}>
              Teslimat Adresi
            </p>
            <p style={{ margin: 0, color: 'var(--text-color)' }}>
              {order.customer_name} - {order.delivery_address}
            </p>
          </div>
        </div>
      )}

      {/* Zaman Çizelgesi */}
      {order && order.status !== 'cancelled' && statusStep >= 0 && (
        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`${styles.step} ${index <= statusStep ? styles.active : ''}`}
            >
              <div className={styles.icon}>
                {index <= statusStep ? '✓' : index + 1}
              </div>
              <div className={styles.content}>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {index <= statusStep && (
                  <small style={{ color: 'var(--primary-color)' }}>{step.time}</small>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Siparişlerime Dön */}
      {order && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => navigate('/orders')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--surface-color)',
              color: 'var(--text-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            ← Siparişlerime Dön
          </button>
        </div>
      )}
    </div>
  );
}
