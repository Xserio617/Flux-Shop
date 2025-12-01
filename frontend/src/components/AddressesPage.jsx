import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    full_name: '',
    phone: '',
    city: '',
    district: '',
    neighborhood: '',
    address_line: '',
    postal_code: '',
    is_default: false
  });

  // Adresleri yükle
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/users/addresses/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data);
    } catch (error) {
      console.error('Adresler yüklenemedi:', error);
      toast.error('Adresler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [isLoggedIn, navigate]);

  // Form input değişikliği
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Formu sıfırla
  const resetForm = () => {
    setFormData({
      title: '',
      full_name: '',
      phone: '',
      city: '',
      district: '',
      neighborhood: '',
      address_line: '',
      postal_code: '',
      is_default: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  // Yeni adres ekle veya güncelle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (editingAddress) {
        // Güncelleme
        await axios.put(`/api/users/addresses/${editingAddress.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Adres güncellendi! ✅');
      } else {
        // Yeni ekle
        await axios.post('/api/users/addresses/', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Adres eklendi! 🏠');
      }
      
      resetForm();
      fetchAddresses();
    } catch (error) {
      const errorMsg = error.response?.data?.non_field_errors?.[0] || 
                       error.response?.data?.detail ||
                       'Adres kaydedilemedi!';
      toast.error(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  // Adres düzenleme
  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      title: address.title,
      full_name: address.full_name,
      phone: address.phone,
      city: address.city,
      district: address.district,
      neighborhood: address.neighborhood || '',
      address_line: address.address_line,
      postal_code: address.postal_code || '',
      is_default: address.is_default
    });
    setShowForm(true);
  };

  // Adres silme
  const handleDelete = async (id) => {
    if (!window.confirm('Bu adresi silmek istediğinize emin misiniz?')) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/users/addresses/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Adres silindi! 🗑️');
      fetchAddresses();
    } catch (error) {
      toast.error('Adres silinemedi!');
    }
  };

  // Varsayılan yapma
  const handleSetDefault = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`/api/users/addresses/${id}/set-default/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Varsayılan adres güncellendi! ⭐');
      fetchAddresses();
    } catch (error) {
      toast.error('Varsayılan adres ayarlanamadı!');
    }
  };

  // Başlık ikonları
  const getTitleIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('ev')) return '🏠';
    if (lowerTitle.includes('okul')) return '🎓';
    if (lowerTitle.includes('iş') || lowerTitle.includes('ofis')) return '🏢';
    if (lowerTitle.includes('aile')) return '👨‍👩‍👧‍👦';
    return '📍';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-color)' }}>
        Adresler Yükleniyor...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px 10%', 
      minHeight: '80vh', 
      backgroundColor: 'var(--background-color)', 
      color: 'var(--text-color)' 
    }}>
      
      {/* Başlık ve Geri Butonu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/profile')}
          style={{
            backgroundColor: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '10px 15px',
            cursor: 'pointer',
            color: 'var(--text-color)',
            fontSize: '16px'
          }}
        >
          ← Geri
        </button>
        <h1 style={{ margin: 0, color: 'var(--secondary-color)' }}>📍 Adreslerim</h1>
      </div>

      {/* Yeni Adres Ekle Butonu */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '30px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          ➕ Yeni Adres Ekle
        </button>
      )}

      {/* Adres Formu */}
      {showForm && (
        <div style={{
          backgroundColor: 'var(--surface-color)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '30px',
          border: '1px solid var(--border-color)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '25px' }}>
            {editingAddress ? '✏️ Adresi Düzenle' : '🏠 Yeni Adres Ekle'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Adres Başlığı */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Adres Başlığı *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Örn: Evim, Okulum, İş Yerim"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Ad Soyad ve Telefon */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Alıcı Adı Soyadı *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Ad Soyad"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-color)',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Telefon *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="05XX XXX XX XX"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-color)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* İl, İlçe, Mahalle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  İl *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="İstanbul"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-color)',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  İlçe *
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="Beşiktaş"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-color)',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Mahalle
                </label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  placeholder="Levent Mah."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-color)',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            {/* Açık Adres */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Açık Adres *
              </label>
              <textarea
                name="address_line"
                value={formData.address_line}
                onChange={handleInputChange}
                placeholder="Sokak, bina no, daire no vb."
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Posta Kodu ve Varsayılan */}
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Posta Kodu
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="34XXX"
                  style={{
                    width: '150px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--background-color)',
                    color: 'var(--text-color)',
                    fontSize: '14px'
                  }}
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '25px' }}>
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span>Varsayılan adres olarak ayarla ⭐</span>
              </label>
            </div>

            {/* Butonlar */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                  opacity: formLoading ? 0.7 : 1,
                  fontSize: '16px'
                }}
              >
                {formLoading ? 'Kaydediliyor...' : (editingAddress ? 'Güncelle' : 'Kaydet')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-color)',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Adres Listesi */}
      {addresses.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          backgroundColor: 'var(--surface-color)',
          borderRadius: '15px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📭</div>
          <h2 style={{ marginBottom: '10px' }}>Henüz adres eklemediniz</h2>
          <p style={{ color: 'var(--text-light)' }}>
            Evim, Okulum, İş Yerim gibi adreslerinizi kaydedin, siparişte hızlıca seçin!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {addresses.map(address => (
            <div
              key={address.id}
              style={{
                backgroundColor: 'var(--surface-color)',
                borderRadius: '15px',
                padding: '25px',
                border: address.is_default 
                  ? '2px solid var(--primary-color)' 
                  : '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              {/* Varsayılan Badge */}
              {address.is_default && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '15px',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  ⭐ Varsayılan
                </div>
              )}

              {/* Başlık */}
              <h3 style={{ 
                margin: '0 0 15px 0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontSize: '18px'
              }}>
                <span style={{ fontSize: '24px' }}>{getTitleIcon(address.title)}</span>
                {address.title}
              </h3>

              {/* Bilgiler */}
              <div style={{ marginBottom: '15px', lineHeight: '1.7' }}>
                <div style={{ fontWeight: '500' }}>{address.full_name}</div>
                <div style={{ color: 'var(--text-light)' }}>{address.phone}</div>
                <div style={{ marginTop: '10px', color: 'var(--text-light)' }}>
                  {address.full_address}
                </div>
              </div>

              {/* Aksiyonlar */}
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '15px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => handleEdit(address)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--primary-color)',
                    color: 'var(--primary-color)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '13px'
                  }}
                >
                  ✏️ Düzenle
                </button>
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-color)',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '13px'
                    }}
                  >
                    ⭐ Varsayılan Yap
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '13px'
                  }}
                >
                  🗑️ Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
