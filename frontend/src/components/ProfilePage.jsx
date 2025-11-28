import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Aktif sekme: 'profile' veya 'security'
  const [activeTab, setActiveTab] = useState('profile');
  
  // Parola değiştirme form state'leri
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Kullanıcı adı değiştirme form state'leri
  const [usernamePassword, setUsernamePassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
        navigate('/login');
        return;
    }

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            
            // Token var mı kontrol et
            if (!token) {
                throw new Error("Token bulunamadı!");
            }

            const response = await axios.get('/api/users/me/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setUser(response.data);
            setLoading(false);
            
        } catch (error) {
            console.error("Profil hatası detaylı:", error);
            
            // !!! DÜZELTME BURADA !!!
            // Hemen logout yapmıyoruz, hatayı ekrana basıyoruz.
            // logout(); <--- BU SATIRI İPTAL ETTİK
            
            setErrorMsg(error.response?.data?.detail || error.message || "Bağlantı Hatası");
            setLoading(false);
        }
    };

    fetchProfile();
  }, [isLoggedIn, navigate]);

  // PAROLA DEĞİŞTİRME FONKSİYONU
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== newPassword2) {
      toast.error("Yeni parolalar eşleşmiyor!");
      return;
    }
    
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put('/api/users/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password2: newPassword2
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Parola başarıyla değiştirildi! 🎉");
      setCurrentPassword('');
      setNewPassword('');
      setNewPassword2('');
    } catch (error) {
      const errorMsg = error.response?.data?.current_password?.[0] || 
                       error.response?.data?.new_password?.[0] ||
                       error.response?.data?.non_field_errors?.[0] ||
                       "Parola değiştirilemedi!";
      toast.error(errorMsg);
    }
    setPasswordLoading(false);
  };

  // KULLANICI ADI DEĞİŞTİRME FONKSİYONU
  const handleUsernameChange = async (e) => {
    e.preventDefault();
    
    if (!newUsername.trim()) {
      toast.error("Kullanıcı adı boş olamaz!");
      return;
    }
    
    setUsernameLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put('/api/users/change-username/', {
        current_password: usernamePassword,
        new_username: newUsername
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Kullanıcı adı başarıyla değiştirildi! 🎉");
      setUser({ ...user, username: response.data.username });
      setUsernamePassword('');
      setNewUsername('');
    } catch (error) {
      const errorMsg = error.response?.data?.current_password?.[0] || 
                       error.response?.data?.new_username?.[0] ||
                       "Kullanıcı adı değiştirilemedi!";
      toast.error(errorMsg);
    }
    setUsernameLoading(false);
  };

  if (loading) return <div style={{textAlign:'center', padding:'100px', color:'var(--text-color)'}}>Profil Yükleniyor...</div>;

  // HATA VARSA EKRANA BAS (Kullanıcıyı atma)
  if (errorMsg) return (
    <div style={{textAlign:'center', padding:'100px', color:'red'}}>
        <h2>Bir Hata Oluştu!</h2>
        <p>{errorMsg}</p>
        <button onClick={logout} className="btn-primary" style={{marginTop: '20px', backgroundColor: 'red'}}>
            Çıkış Yap ve Tekrar Dene
        </button>
    </div>
  );

  if (!user) return null;

  return (
    <div style={{ padding: '40px 10%', minHeight: '80vh', backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
      
      <h1 style={{ marginBottom: '30px', color: 'var(--secondary-color)' }}>Hesabım</h1>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* SOL MENÜ */}
        <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ backgroundColor: 'var(--surface-color)', borderRadius: '10px', padding: '20px', border: '1px solid var(--border-color)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li 
                        onClick={() => setActiveTab('profile')}
                        style={{ 
                          marginBottom: '15px', 
                          fontWeight: activeTab === 'profile' ? 'bold' : 'normal', 
                          color: activeTab === 'profile' ? 'var(--primary-color)' : 'var(--text-color)', 
                          cursor: 'pointer',
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: activeTab === 'profile' ? 'var(--background-color)' : 'transparent',
                          transition: 'all 0.2s ease'
                        }}
                    >
                        👤 Profil Bilgileri
                    </li>
                    <li 
                        onClick={() => setActiveTab('security')}
                        style={{ 
                          marginBottom: '15px', 
                          fontWeight: activeTab === 'security' ? 'bold' : 'normal', 
                          color: activeTab === 'security' ? 'var(--primary-color)' : 'var(--text-color)', 
                          cursor: 'pointer',
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: activeTab === 'security' ? 'var(--background-color)' : 'transparent',
                          transition: 'all 0.2s ease'
                        }}
                    >
                        🔒 Güvenlik
                    </li>
                    <li 
                        onClick={() => navigate('/orders')}
                        style={{ 
                          marginBottom: '15px', 
                          fontWeight: 'normal', 
                          color: 'var(--text-color)', 
                          cursor: 'pointer',
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: 'transparent',
                          transition: 'all 0.2s ease'
                        }}
                    >
                        📦 Siparişlerim
                    </li>
                    <li 
                        onClick={logout}
                        style={{ 
                          color: '#ef4444', 
                          cursor: 'pointer', 
                          fontWeight: 'bold', 
                          borderTop: '1px solid var(--border-color)', 
                          paddingTop: '15px',
                          padding: '15px 10px 10px 10px'
                        }}
                    >
                        🚪 Çıkış Yap
                    </li>
                </ul>
            </div>
        </div>

        {/* SAĞ İÇERİK */}
        <div style={{ flex: 3, minWidth: '300px' }}>
            <div style={{ backgroundColor: 'var(--surface-color)', borderRadius: '10px', padding: '30px', border: '1px solid var(--border-color)' }}>
                
                {/* PROFİL BİLGİLERİ SEKMESİ */}
                {activeTab === 'profile' && (
                  <>
                    <h2 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Kişisel Bilgiler</h2>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-light)', fontSize: '14px' }}>Kullanıcı Adı</label>
                        <div style={{ fontSize: '18px', fontWeight: '500' }}>{user.username}</div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-light)', fontSize: '14px' }}>E-Posta Adresi</label>
                        <div style={{ fontSize: '18px', fontWeight: '500' }}>{user.email}</div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-light)', fontSize: '14px' }}>Kayıt Tarihi</label>
                        <div style={{ fontSize: '18px', fontWeight: '500' }}>
                            {new Date(user.date_joined).toLocaleDateString('tr-TR')}
                        </div>
                    </div>
                  </>
                )}

                {/* GÜVENLİK SEKMESİ */}
                {activeTab === 'security' && (
                  <>
                    <h2 style={{ marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>🔒 Güvenlik Ayarları</h2>
                    
                    {/* KULLANICI ADI DEĞİŞTİRME */}
                    <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'var(--background-color)', borderRadius: '12px' }}>
                      <h3 style={{ marginBottom: '20px', color: 'var(--text-color)', fontSize: '16px' }}>Kullanıcı Adı Değiştir</h3>
                      <form onSubmit={handleUsernameChange}>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', color: 'var(--text-light)', fontSize: '14px', marginBottom: '5px' }}>Mevcut Parola</label>
                          <input 
                            type="password" 
                            value={usernamePassword}
                            onChange={(e) => setUsernamePassword(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--surface-color)',
                              color: 'var(--text-color)',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', color: 'var(--text-light)', fontSize: '14px', marginBottom: '5px' }}>Yeni Kullanıcı Adı</label>
                          <input 
                            type="text" 
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            required
                            placeholder={user.username}
                            style={{
                              width: '100%',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--surface-color)',
                              color: 'var(--text-color)',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={usernameLoading}
                          style={{
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: '600',
                            cursor: usernameLoading ? 'not-allowed' : 'pointer',
                            opacity: usernameLoading ? 0.7 : 1
                          }}
                        >
                          {usernameLoading ? 'Değiştiriliyor...' : 'Kullanıcı Adını Değiştir'}
                        </button>
                      </form>
                    </div>

                    {/* PAROLA DEĞİŞTİRME */}
                    <div style={{ padding: '20px', backgroundColor: 'var(--background-color)', borderRadius: '12px' }}>
                      <h3 style={{ marginBottom: '20px', color: 'var(--text-color)', fontSize: '16px' }}>Parola Değiştir</h3>
                      <form onSubmit={handlePasswordChange}>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', color: 'var(--text-light)', fontSize: '14px', marginBottom: '5px' }}>Mevcut Parola</label>
                          <input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--surface-color)',
                              color: 'var(--text-color)',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ display: 'block', color: 'var(--text-light)', fontSize: '14px', marginBottom: '5px' }}>Yeni Parola</label>
                          <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--surface-color)',
                              color: 'var(--text-color)',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                          <label style={{ display: 'block', color: 'var(--text-light)', fontSize: '14px', marginBottom: '5px' }}>Yeni Parola (Tekrar)</label>
                          <input 
                            type="password" 
                            value={newPassword2}
                            onChange={(e) => setNewPassword2(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--surface-color)',
                              color: 'var(--text-color)',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={passwordLoading}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: '600',
                            cursor: passwordLoading ? 'not-allowed' : 'pointer',
                            opacity: passwordLoading ? 0.7 : 1
                          }}
                        >
                          {passwordLoading ? 'Değiştiriliyor...' : 'Parolayı Değiştir'}
                        </button>
                      </form>
                    </div>
                  </>
                )}

            </div>
        </div>

      </div>
    </div>
  );
}