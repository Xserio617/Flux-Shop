import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import FluxLogo from './icons/FluxLogo'; // Logo Bileşeni

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* 1. SÜTUN: Marka ve Hakkında */}
        <div className={styles.column}>
            {/* Logo: Footer koyu olduğu için rengi 'white' yapıyoruz */}
            <Link to="/" className={styles.logo} style={{ color: 'white', display: 'inline-block' }}>
                <FluxLogo height="35px" />
            </Link>
            <p className={styles.description}>
                FLUX ile teknolojinin nabzını tutun. En yeni ürünler, en iyi fiyatlar ve güvenli alışverişin adresi.
            </p>
            <div className={styles.socials}>
                <div className={styles.socialIcon}>F</div>
                <div className={styles.socialIcon}>T</div>
                <div className={styles.socialIcon}>I</div>
                <div className={styles.socialIcon}>Y</div>
            </div>
        </div>

        {/* 2. SÜTUN: Kurumsal */}
        <div className={styles.column}>
            <h4 className={styles.heading}>Kurumsal</h4>
            <ul className={styles.list}>
                <li><Link to="/">Anasayfa</Link></li>
                <li><Link to="/hakkimizda">Hakkımızda</Link></li>
                <li><Link to="/kariyer">Kariyer</Link></li>
                <li><Link to="/iletisim">İletişim</Link></li>
            </ul>
        </div>

        {/* 3. SÜTUN: Yardım (Kargo Takip Burada) */}
        <div className={styles.column}>
            <h4 className={styles.heading}>Yardım</h4>
            <ul className={styles.list}>
                <li><Link to="/sss">Sıkça Sorulan Sorular</Link></li>
                <li><Link to="/kargo-takip">Kargo Takip 🚚</Link></li>
                <li><Link to="/iade">İade ve Değişim</Link></li>
                <li><Link to="/gizlilik">Gizlilik Politikası</Link></li>
            </ul>
        </div>

        {/* 4. SÜTUN: İletişim Bilgileri */}
        <div className={styles.column}>
            <h4 className={styles.heading}>Bize Ulaşın</h4>
            <ul className={styles.list}>
                <li>📍 Simav, Kütahya / Türkiye</li>
                <li>📞 +90 (850) 123 45 67</li>
                <li>✉️ destek@flux.com</li>
                <li>⏰ Pzt - Cum: 09:00 - 18:00</li>
            </ul>
        </div>

      </div>

      {/* En Alt: Telif Hakkı */}
      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} FLUX Teknoloji A.Ş. - Tüm Hakları Saklıdır. Design by xserio & Gemini.
      </div>
    </footer>
  );
}