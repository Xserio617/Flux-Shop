import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await fetch('/api/orders/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Siparişler yüklenemedi');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Siparişler yükleme hatası:', error);
      toast.error('Siparişler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const statusMap = {
      pending: '#FFA500',
      processing: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336',
    };
    return statusMap[status] || '#999';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Beklemede',
      processing: 'İşleniyor',
      shipped: 'Gönderildi',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi',
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{
        padding: '50px',
        textAlign: 'center',
        color: 'var(--text-color)',
        backgroundColor: 'var(--background-color)',
        minHeight: '80vh',
      }}>
        Yükleniyor...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{
        padding: '50px',
        textAlign: 'center',
        color: 'var(--text-color)',
        backgroundColor: 'var(--background-color)',
        minHeight: '80vh',
      }}>
        <h2>Hiçbir siparişiniz yok</h2>
        <p>Alışveriş yapmaya başlamak için ürünleri keşfet!</p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Alışverişe Başla
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px 10%',
      backgroundColor: 'var(--background-color)',
      minHeight: '80vh',
      color: 'var(--text-color)',
    }}>
      <h1 style={{ color: 'var(--secondary-color)', marginBottom: '30px' }}>Siparişlerim</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              backgroundColor: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {/* Sipariş Başlığı */}
            <div
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              style={{
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--surface-color)',
                borderBottom: expandedOrder === order.id ? '1px solid var(--border-color)' : 'none',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 10px 0' }}>Sipariş #{order.order_number}</h3>
                <p style={{ margin: '5px 0', fontSize: '14px', color: 'var(--text-light)' }}>
                  Tarih: {formatDate(order.created_at)}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-light)' }}>Toplam:</p>
                  <p style={{ margin: '5px 0', fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {order.total_price} TL
                  </p>
                </div>

                <div
                  style={{
                    padding: '8px 16px',
                    backgroundColor: getStatusBadgeColor(order.status),
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    minWidth: '100px',
                    textAlign: 'center',
                  }}
                >
                  {getStatusText(order.status)}
                </div>

                <span style={{ fontSize: '20px' }}>
                  {expandedOrder === order.id ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {/* Sipariş Detayları (Expandable) */}
            {expandedOrder === order.id && (
              <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
                {/* Teslimat Adresi */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Teslimat Adresi</h4>
                  <p style={{
                    margin: '0',
                    padding: '10px',
                    backgroundColor: 'var(--background-color)',
                    borderRadius: '5px',
                    lineHeight: '1.6',
                  }}>
                    {order.customer_name}
                    <br />
                    {order.delivery_address}
                  </p>
                </div>

                {/* Ürünler */}
                <h4 style={{ margin: '0 0 15px 0' }}>Ürünler</h4>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                }}>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '15px',
                        padding: '15px',
                        backgroundColor: 'var(--background-color)',
                        borderRadius: '8px',
                        alignItems: 'center',
                      }}
                    >
                      {/* Ürün Resmi */}
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '5px',
                          objectFit: 'cover',
                        }}
                      />

                      {/* Ürün Bilgileri */}
                      <div style={{ flex: 1 }}>
                        <h5 style={{ margin: '0 0 5px 0' }}>{item.product_name}</h5>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: 'var(--text-light)' }}>
                          Miktar: {item.quantity}x
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '14px', color: 'var(--text-light)' }}>
                          Birim Fiyatı: {item.product_price} TL
                        </p>
                      </div>

                      {/* Satır Toplamı */}
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-light)' }}>Toplam:</p>
                        <p style={{
                          margin: '5px 0',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: 'var(--primary-color)',
                        }}>
                          {(item.quantity * item.price).toFixed(2)} TL
                        </p>
                      </div>

                      {/* Ürüne Git */}
                      <button
                        onClick={() => navigate(`/product/${item.product}`)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'var(--primary-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Ürüne Git
                      </button>
                    </div>
                  ))}
                </div>

                {/* Sipariş Detayları */}
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: 'var(--background-color)',
                  borderRadius: '8px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '15px',
                }}>
                  <div>
                    <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-light)' }}>Sipariş Numarası</p>
                    <p style={{ margin: '5px 0', fontWeight: '600' }}>{order.order_number}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-light)' }}>Sipariş Tarihi</p>
                    <p style={{ margin: '5px 0', fontWeight: '600' }}>{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-light)' }}>Durum</p>
                    <p style={{ margin: '5px 0', fontWeight: '600' }}>{getStatusText(order.status)}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-light)' }}>Son Güncelleme</p>
                    <p style={{ margin: '5px 0', fontWeight: '600' }}>{formatDate(order.updated_at)}</p>
                  </div>
                </div>

                {/* Kargo Takip Butonu */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/kargo-takip?order=${order.order_number}`);
                    }}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#9C27B0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                     Kargo Takip
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
