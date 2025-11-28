import React from 'react';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Hakkımızda</h1>
        
        <section className={styles.intro}>
          <p>
            <strong>FLUX Teknoloji</strong>, 2018 yılında kurulan ve Türkiye'nin en dinamik 
            teknoloji e-ticaret platformlarından birisidir. Misyonumuz, son teknoloji ürünlerini 
            uygun fiyatlarla ve kaliteli hizmetle müşterilerimize sunmaktır.
          </p>
        </section>

        <section>
          <h2>Vizyon & Misyon</h2>
          <div className={styles.visionGrid}>
            <div className={styles.visionBox}>
              <h3>Vizyon</h3>
              <p>
                Türkiye'de ve Avrupa'da teknoloji ürünleri alanında öncü ve güvenilir marka olmak; 
                müşteri memnuniyeti ve inovasyonu her zaman ön planda tutmak.
              </p>
            </div>
            <div className={styles.visionBox}>
              <h3>Misyon</h3>
              <p>
                Her müşterimize en kaliteli ürünleri, en iyi fiyatlarla ve hızlı teslimatla 
                sunmak; teknoloji ve tutkunun buluştuğu bir platform oluşturmak.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Neden Biz?</h2>
          <ul className={styles.featuresList}>
            <li>
              <strong>✓ Geniş Ürün Yelpazesi:</strong> Laptop, masaüstü, GPU, işlemci, RAM, SSD 
              ve daha pek çok teknoloji ürünü
            </li>
            <li>
              <strong>✓ Uygun Fiyatlar:</strong> Piyasanın en rekabetçi fiyatları ve düzenli indirimler
            </li>
            <li>
              <strong>✓ Hızlı Kargo:</strong> İstanbul içinde 24 saat, Türkiye genelinde 2-3 gün içinde teslimat
            </li>
            <li>
              <strong>✓ Güvenli Ödeme:</strong> 256-bit SSL şifreleme ve güvenli ödeme sistemleri
            </li>
            <li>
              <strong>✓ 7/24 Müşteri Desteği:</strong> Her zaman yardımcı ve bilgili takımımız sizin hizmetinde
            </li>
            <li>
              <strong>✓ 30 Gün Para İade Garantisi:</strong> Memnun değilseniz çok kolay iade yapabilirsiniz
            </li>
            <li>
              <strong>✓ Orijinal Ürünler:</strong> Tüm ürünler orijinal ve resmi saticilarca sağlanır
            </li>
            <li>
              <strong>✓ Teknik Destek:</strong> Ürün seçiminden sonra kurulum ve kullanım danışmanlığı
            </li>
          </ul>
        </section>

        <section>
          <h2>Tarihçe</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <h4>2018</h4>
              <p>FLUX Teknoloji kuruluyor, online platform başlatılıyor</p>
            </div>
            <div className={styles.timelineItem}>
              <h4>2019</h4>
              <p>İlk 10.000 müşteriye ulaşılıyor, müşteri memnuniyeti %98</p>
            </div>
            <div className={styles.timelineItem}>
              <h4>2021</h4>
              <p>Ürün yelpazesi genişletiliyor, 500+ ürün portföy oluşturuluyor</p>
            </div>
            <div className={styles.timelineItem}>
              <h4>2023</h4>
              <p>50.000+ müşteri, GPU/Gaming kategorisinde lider konumu</p>
            </div>
            <div className={styles.timelineItem}>
              <h4>2025</h4>
              <p>Yeni platform tasarımı, AI-tabanlı ürün önerileri, mobil app</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Ayrıntılar</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <h3>50,000+</h3>
              <p>Mutlu Müşteri</p>
            </div>
            <div className={styles.statBox}>
              <h3>500+</h3>
              <p>Kaliteli Ürün</p>
            </div>
            <div className={styles.statBox}>
              <h3>%98</h3>
              <p>Memnuniyet Oranı</p>
            </div>
            <div className={styles.statBox}>
              <h3>24 Saat</h3>
              <p>İstanbul'da Teslimat</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Ekibimiz</h2>
          <p>
            FLUX Teknoloji ekibi, teknoloji alanında deneyimli ve müşteri hizmetlerine 
            tutkulu profesyonellerden oluşmaktadır. Amacımız, her bir müşterimize en iyi 
            deneyimi sağlamak ve teknoloji dünyasında yanlarında olmaktır.
          </p>
        </section>

        <section>
          <h2>İletişim</h2>
          <p>Bize aşağıdaki kanallardan ulaşabilirsiniz:</p>
          <ul>
            <li><strong>E-posta:</strong> info@flux.com.tr</li>
            <li><strong>Telefon:</strong> +90 (212) 555-0001</li>
            <li><strong>Adres:</strong> FLUX Teknoloji A.Ş., Beşiktaş, İstanbul, Türkiye</li>
            <li><strong>Çalışma Saatleri:</strong> Pazartesi-Cuma 09:00-18:00</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
