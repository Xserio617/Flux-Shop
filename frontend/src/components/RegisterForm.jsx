import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/api';

const RECAPTCHA_SITE_KEY = '6LeKNBgsAAAAAG-P9vA_YrH7Z7mua2Xm-W-A-NTJ';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  // Google ile kayıt/giriş başarılı
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsGoogleLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/google-login/`, {
        credential: credentialResponse.credential
      });
      
      const { access, refresh, user, created } = response.data;
      login(access, refresh);
      
      if (created) {
        toast.success(`Hoş geldin ${user.first_name || user.username}! Hesabın oluşturuldu. 🎉`, { theme: "colored" });
      } else {
        toast.success(`Tekrar hoş geldin ${user.first_name || user.username}! 🎉`, { theme: "colored" });
      }
      
      navigate('/');
    } catch (err) {
      console.error("Google Login Hatası:", err.response?.data || err);
      toast.error(err.response?.data?.error || 'Google ile kayıt başarısız! ❌', { theme: "colored" });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Google ile giriş başarısız
  const handleGoogleError = () => {
    toast.error('Google ile kayıt iptal edildi veya başarısız oldu.', { theme: "colored" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaVerified) {
      toast.error('Lütfen robot olmadığınızı doğrulayın! 🤖', { theme: "colored" });
      return;
    }
    
    try {
      await axios.post('/api/users/register/', formData);
      toast.success('Hesabınız oluşturuldu! Giriş yapabilirsiniz. 🎉', { theme: "colored" });
      navigate('/login'); 
    } catch (err) {
      console.error("Kayıt Hatası:", err.response.data);
      if (err.response && err.response.data) {
        const errorMsg = Object.values(err.response.data)[0];
        toast.error(errorMsg[0] || 'Kayıt başarısız.', { theme: "colored" });
      } else {
        toast.error('Sunucu hatası.', { theme: "colored" });
      }
      // Hata durumunda captcha'yı sıfırla
      recaptchaRef.current?.reset();
      setCaptchaVerified(false);
    }
  };

  // Ortak input stili
  const inputStyle = {
    padding: '12px', 
    border: '1px solid var(--border-color)', 
    borderRadius: '8px', 
    fontSize: '16px',
    backgroundColor: 'var(--background-color)',
    color: 'var(--text-color)',
    outline: 'none'
  };

  return (
    <div style={{ padding: '10px 0' }}>
      <h2 style={{ color: 'var(--secondary-color)', marginBottom: '20px', textAlign: 'center' }}>
        Aramıza Katılın
      </h2>
      
      {/* Google ile Kayıt Butonu */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '20px',
        opacity: isGoogleLoading ? 0.6 : 1,
        pointerEvents: isGoogleLoading ? 'none' : 'auto'
      }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_blue"
          size="large"
          text="signup_with"
          shape="rectangular"
          locale="tr"
          width="320"
        />
      </div>
      
      {/* Ayırıcı */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        margin: '20px 0',
        gap: '10px'
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
        <span style={{ color: 'var(--text-light)', fontSize: '14px' }}>veya</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input type="email" name="email" placeholder="E-Posta" onChange={handleChange} required style={inputStyle}/>
        <input type="text" name="username" placeholder="Kullanıcı Adı" onChange={handleChange} required style={inputStyle}/>
        <input type="password" name="password" placeholder="Şifre" onChange={handleChange} required style={inputStyle}/>
        <input type="password" name="password2" placeholder="Şifre Tekrarı" onChange={handleChange} required style={inputStyle}/>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
            theme="dark"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary" 
          style={{ 
            padding: '12px', 
            fontSize: '16px', 
            marginTop: '10px',
            opacity: captchaVerified ? 1 : 0.6,
            cursor: captchaVerified ? 'pointer' : 'not-allowed'
          }}
          disabled={!captchaVerified}
        >
          HEMEN ÜYE OL
        </button>
      </form>
    </div>
  );
}