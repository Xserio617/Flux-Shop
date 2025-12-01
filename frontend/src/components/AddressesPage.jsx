import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './AddressesPage.module.css';

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
        await axios.put(`/api/users/addresses/${editingAddress.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Adres güncellendi! ✅');
      } else {
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
    // Mobilde form'a scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    return <div className={styles.loading}>Adresler Yükleniyor...</div>;
  }

  return (
    <div className={styles.container}>
      
      {/* Başlık ve Geri Butonu */}
      <div className={styles.header}>
        <button onClick={() => navigate('/profile')} className={styles.backButton}>
          ← Geri
        </button>
        <h1 className={styles.title}>📍 Adreslerim</h1>
      </div>

      {/* Yeni Adres Ekle Butonu */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} className={styles.addButton}>
          ➕ Yeni Adres Ekle
        </button>
      )}

      {/* Adres Formu */}
      {showForm && (
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>
            {editingAddress ? '✏️ Adresi Düzenle' : '🏠 Yeni Adres Ekle'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Adres Başlığı */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Adres Başlığı *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Örn: Evim, Okulum, İş Yerim"
                required
                className={styles.input}
              />
            </div>

            {/* Ad Soyad ve Telefon */}
            <div className={styles.twoColumnGrid}>
              <div>
                <label className={styles.label}>Alıcı Adı Soyadı *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Ad Soyad"
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>Telefon *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="05XX XXX XX XX"
                  required
                  className={styles.input}
                />
              </div>
            </div>

            {/* İl, İlçe, Mahalle */}
            <div className={styles.threeColumnGrid}>
              <div>
                <label className={styles.label}>İl *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="İstanbul"
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>İlçe *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="Beşiktaş"
                  required
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>Mahalle</label>
                <input
                  type="text"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  placeholder="Levent Mah."
                  className={styles.input}
                />
              </div>
            </div>

            {/* Açık Adres */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Açık Adres *</label>
              <textarea
                name="address_line"
                value={formData.address_line}
                onChange={handleInputChange}
                placeholder="Sokak, bina no, daire no vb."
                required
                rows={3}
                className={styles.textarea}
              />
            </div>

            {/* Posta Kodu ve Varsayılan */}
            <div className={styles.flexRow}>
              <div>
                <label className={styles.label}>Posta Kodu</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="34XXX"
                  className={styles.postalInput}
                />
              </div>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                <span>Varsayılan adres olarak ayarla ⭐</span>
              </label>
            </div>

            {/* Butonlar */}
            <div className={styles.buttonGroup}>
              <button type="submit" disabled={formLoading} className={styles.submitButton}>
                {formLoading ? 'Kaydediliyor...' : (editingAddress ? 'Güncelle' : 'Kaydet')}
              </button>
              <button type="button" onClick={resetForm} className={styles.cancelButton}>
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Adres Listesi */}
      {addresses.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <h2 className={styles.emptyTitle}>Henüz adres eklemediniz</h2>
          <p className={styles.emptyText}>
            Evim, Okulum, İş Yerim gibi adreslerinizi kaydedin, siparişte hızlıca seçin!
          </p>
        </div>
      ) : (
        <div className={styles.addressGrid}>
          {addresses.map(address => (
            <div
              key={address.id}
              className={`${styles.addressCard} ${address.is_default ? styles.addressCardDefault : ''}`}
            >
              {/* Varsayılan Badge */}
              {address.is_default && (
                <div className={styles.defaultBadge}>⭐ Varsayılan</div>
              )}

              {/* Başlık */}
              <h3 className={styles.addressTitle}>
                <span className={styles.addressIcon}>{getTitleIcon(address.title)}</span>
                {address.title}
              </h3>

              {/* Bilgiler */}
              <div className={styles.addressInfo}>
                <div className={styles.addressName}>{address.full_name}</div>
                <div className={styles.addressPhone}>{address.phone}</div>
                <div className={styles.addressFull}>{address.full_address}</div>
              </div>

              {/* Aksiyonlar */}
              <div className={styles.actionButtons}>
                <button
                  onClick={() => handleEdit(address)}
                  className={`${styles.actionButton} ${styles.editButton}`}
                >
                  ✏️ Düzenle
                </button>
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className={`${styles.actionButton} ${styles.defaultButton}`}
                  >
                    ⭐ Varsayılan
                  </button>
                )}
                <button
                  onClick={() => handleDelete(address.id)}
                  className={`${styles.actionButton} ${styles.deleteButton}`}
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
