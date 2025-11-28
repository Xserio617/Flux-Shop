import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Context'ler
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Stiller ve İkonlar
import styles from './Navbar.module.css';
import FluxLogo from './icons/FluxLogo';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import HeartIcon from './icons/HeartIcon';
import UserIcon from './icons/UserIcon';
import CartIcon from './icons/CartIcon';

export default function Navbar() {
  const { cart } = useCart();
  const { isLoggedIn, logout } = useAuth(); // Logout'u buradan kaldırdık
  const { theme, toggleTheme } = useTheme();
  
  const totalItems = (cart || []).reduce((total, item) => total + item.quantity, 0);

  // --- ARAMA MANTIĞI ---
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (searchTerm.trim()) {
        navigate(`/search?q=${searchTerm}`);
        setSearchTerm(""); 
    }
  };

  return (
    <nav className={styles.nav}>
      
      {/* 1. LOGO */}
      <Link to="/" className={styles.logo} style={{ color: 'var(--text-color)', display: 'flex', alignItems: 'center' }}>
        <FluxLogo height="40px" />
      </Link>

      {/* 2. ARAMA ÇUBUĞU */}
      <form onSubmit={handleSearch} className={styles.searchContainer}>
        <input 
            type="text" 
            placeholder="Neye ihtiyacın var?" 
            className={styles.searchInput} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className={styles.searchBtn}>Ara</button>
      </form>

      {/* 3. SAĞ TARAF */}
      <div className={styles.actions}>
        
        {/* Tema */}
        <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', color: 'var(--text-color)' }}>
            {theme === 'light' ? <MoonIcon size={24} /> : <SunIcon size={24} />}
        </button>

        {/* Favoriler */}
        <Link to="/favorites" className={styles.link} title="Favorilerim" style={{ display: 'flex', alignItems: 'center' }}>
            <HeartIcon size={24} />
        </Link>

        {/* Sepet */}
        <Link to="/cart" style={{ textDecoration: 'none' }}>
            <button className={styles.cartBtn}>
                <CartIcon size={22} />
                <span>Sepetim</span>
                {totalItems > 0 && (
                    <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', marginLeft: '5px', minWidth: '20px', textAlign: 'center', lineHeight: '1.2' }}>
                        {totalItems}
                    </span>
                )}
            </button>
        </Link>

        {/* Kullanıcı / Giriş */}
        {isLoggedIn ? (
            <Link to="/profile" title="Hesabım" style={{ textDecoration: 'none' }}>
                {/* !!! BURASI GÜNCELLENDİ: ARTIK CSS CLASS KULLANIYOR !!! */}
                <div className={styles.profileBtn}>
                    <UserIcon size={24} />
                </div>
            </Link>
        ) : (
            <Link to="/login" className={styles.link} style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                Giriş Yap
            </Link>
        )}

      </div>
    </nav>
  )
}