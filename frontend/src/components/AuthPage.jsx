import React, { useState } from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh', 
        backgroundColor: 'var(--background-color)', // <-- ZEMİN DEĞİŞKENİ
        padding: '50px 0'
    }}>
      <div style={{ 
          backgroundColor: 'var(--surface-color)', // <-- KART RENGİ (Koyu/Açık)
          padding: '40px', 
          borderRadius: '10px', 
          boxShadow: 'var(--shadow-lg)', // <-- GÖLGE DEĞİŞKENİ
          width: '400px',
          border: '1px solid var(--border-color)'
      }}>
        
        {/* Giriş Yap / Üye Ol Tabları */}
        <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '2px solid var(--border-color)' }}>
          <button
            onClick={() => setIsRegister(false)}
            style={{ 
                flex: 1, padding: '10px', border: 'none', 
                backgroundColor: 'transparent', 
                color: isRegister ? 'var(--text-light)' : 'var(--primary-color)',
                fontWeight: 'bold', 
                cursor: 'pointer',
                borderBottom: isRegister ? 'none' : '3px solid var(--primary-color)',
                transition: 'all 0.3s'
            }}
          >
            GİRİŞ YAP
          </button>
          <button
            onClick={() => setIsRegister(true)}
            style={{ 
                flex: 1, padding: '10px', border: 'none', 
                backgroundColor: 'transparent',
                color: isRegister ? 'var(--primary-color)' : 'var(--text-light)',
                fontWeight: 'bold', 
                cursor: 'pointer',
                borderBottom: isRegister ? '3px solid var(--primary-color)' : 'none',
                transition: 'all 0.3s'
            }}
          >
            ÜYE OL
          </button>
        </div>

        {/* Form Alanı */}
        {isRegister ? (
          <RegisterForm />
        ) : (
          <LoginForm />
        )}

      </div>
    </div>
  );
}