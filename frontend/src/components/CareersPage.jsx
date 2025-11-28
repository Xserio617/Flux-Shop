import React from 'react';
import styles from './CareersPage.module.css';

export default function CareersPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Kariyer</h1>
        
        <section className={styles.intro}>
          <p>
            <strong>FLUX Teknoloji'de</strong> çalışmak demek, dinamik bir ekipte teknoloji 
            alanında yetkinliğini geliştirip, müşteri memnuniyeti sağlayarak, 
            Türkiye'nin teknoloji sektörüne katkıda bulunmak demektir.
          </p>
        </section>

        <section>
          <h2>Neden FLUX'da Çalışmalısınız?</h2>
          <ul className={styles.benefitsList}>
            <li><strong>✓ Dinamik Ortam:</strong> Sürekli öğrenme ve gelişime imkan</li>
            <li><strong>✓ Rekabetçi Maaş:</strong> Sektöre uygun ve adil ücretlendirme</li>
            <li><strong>✓ Performans Bonusu:</strong> Başarı ve hedeflere göre bonus</li>
            <li><strong>✓ Sağlık Sigortası:</strong> Çalışan ve ailesi için kapsamlı sağlık sigortası</li>
            <li><strong>✓ Eğitim ve Gelişim:</strong> Mesleki eğitim ve kurs destekleri</li>
            <li><strong>✓ Flexible Çalışma:</strong> Uzaktan çalışma seçeneği</li>
            <li><strong>✓ Ekip Etkinlikleri:</strong> Piknik, yıl sonu etkinliği ve sosyal aktiviteler</li>
            <li><strong>✓ Kariyer Gelişimi:</strong> İç promosyon fırsatları</li>
            <li><strong>✓ Nitelikli Ekip:</strong> Teknik bilgiye sahip ve işbirlikçi meslektaşlar</li>
            <li><strong>✓ İnsan Kaynakları:</strong> Destekleyici ve adil insan kaynakları politikası</li>
          </ul>
        </section>

        <section>
          <h2>Açık Pozisyonlar</h2>
          <div className={styles.jobsList}>
            <div className={styles.jobCard}>
              <h3>Satış Danışmanı</h3>
              <p><strong>Konum:</strong> İstanbul (Ofis)</p>
              <p><strong>Nitelikler:</strong></p>
              <ul>
                <li>Lise/Ön Lisans mezunu</li>
                <li>Satış tecrübesi olan aday tercih edilir</li>
                <li>Müşteri hizmetleri bilgisi</li>
                <li>İletişim yeteneği yüksek</li>
              </ul>
              <p><strong>Sorumluluklar:</strong></p>
              <ul>
                <li>Müşterilerle iletişim kurma</li>
                <li>Ürün tavsiyeleri yapma</li>
                <li>Siparişleri alma ve işleme</li>
              </ul>
            </div>

            <div className={styles.jobCard}>
              <h3>Backend Geliştirici (Python/Django)</h3>
              <p><strong>Konum:</strong> İstanbul (Uzaktan)</p>
              <p><strong>Nitelikler:</strong></p>
              <ul>
                <li>Python ve Django bilgisi zorunlu</li>
                <li>SQL/Veritabanı tecrübesi</li>
                <li>REST API geliştirme bilgisi</li>
                <li>Git/GitHub bilgisi</li>
              </ul>
              <p><strong>Sorumluluklar:</strong></p>
              <ul>
                <li>API endpoints geliştirme</li>
                <li>Veritabanı tasarımı</li>
                <li>Kod incelemesi ve test</li>
              </ul>
            </div>

            <div className={styles.jobCard}>
              <h3>Frontend Geliştirici (React)</h3>
              <p><strong>Konum:</strong> İstanbul (Uzaktan)</p>
              <p><strong>Nitelikler:</strong></p>
              <ul>
                <li>React.js bilgisi zorunlu</li>
                <li>JavaScript/ES6 tecrübesi</li>
                <li>CSS/Responsive Design</li>
                <li>Component-based mimarı anlayışı</li>
              </ul>
              <p><strong>Sorumluluklar:</strong></p>
              <ul>
                <li>UI Komponenti geliştirme</li>
                <li>Responsive tasarım</li>
                <li>API entegrasyonu</li>
              </ul>
            </div>

            <div className={styles.jobCard}>
              <h3>Kargo ve Lojistik Sorumlusu</h3>
              <p><strong>Konum:</strong> İstanbul (Ofis)</p>
              <p><strong>Nitelikler:</strong></p>
              <ul>
                <li>Lojistik/Kargo sektöründe tecrübe</li>
                <li>Excel ve temel bilgisayar bilgisi</li>
                <li>İletişim ve koordinasyon becerileri</li>
              </ul>
              <p><strong>Sorumluluklar:</strong></p>
              <ul>
                <li>Siparişlerin kargo firmasına gönderimi</li>
                <li>Kargo takibi ve raporlama</li>
                <li>Müşteri talepleri yönetimi</li>
              </ul>
            </div>

            <div className={styles.jobCard}>
              <h3>Müşteri Hizmetleri Temsilcisi</h3>
              <p><strong>Konum:</strong> İstanbul (Ofis)</p>
              <p><strong>Nitelikler:</strong></p>
              <ul>
                <li>Lise mezunu</li>
                <li>Müşteri hizmetleri tecrübesi</li>
                <li>Sabır ve empatik davranış</li>
                <li>Problem çözme yeteneği</li>
              </ul>
              <p><strong>Sorumluluklar:</strong></p>
              <ul>
                <li>E-posta ve telefon desteği</li>
                <li>Müşteri şikayetlerinin çözümü</li>
                <li>Takip ve raporlama</li>
              </ul>
            </div>

            <div className={styles.jobCard}>
              <h3>Pazarlama Müdürü</h3>
              <p><strong>Konum:</strong> İstanbul (Ofis)</p>
              <p><strong>Nitelikler:</strong></p>
              <ul>
                <li>Lisans derecesi zorunlu</li>
                <li>Pazarlama alanında 3+ yıl tecrübe</li>
                <li>SEO/SEM bilgisi tercih edilir</li>
                <li>E-ticaret sektörü bilgisi</li>
              </ul>
              <p><strong>Sorumluluklar:</strong></p>
              <ul>
                <li>Pazarlama kampanyaları planlaması</li>
                <li>Reklam bütçesi yönetimi</li>
                <li>Performans analizi</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2>Başvuru Süreci</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <h4>1. Başvuru</h4>
              <p>CV ve motivasyon mektubunuzu gönderip</p>
            </div>
            <div className={styles.timelineItem}>
              <h4>2. İnceleme</h4>
              <p>3-5 gün içinde değerlendirilecektir</p>
            </div>
            <div className={styles.timelineItem}>
              <h4>3. Görüşme</h4>
              <p>Seçilen adaylarla ilk görüşme yapılacak</p>
            </div>
            <div className={styles.timelineItem}>
              <h4>4. Test/Teknik</h4>
              <p>Uygun pozisyonlar için test yapılabilir</p>
            </div>
            <div className={styles.timelineItem}>
              <h4>5. Son Görüşme</h4>
              <p>Müdür ve yönetim görüşmesi</p>
            </div>
            <div className={styles.timelineItem}>
              <h4>6. Teklif</h4>
              <p>Başarıyla bitersen teklif alacaksın</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Başvur</h2>
          <p>
            Bir konuma başvurmak için, lütfen aşağıdaki bilgileri gönderiniz:
          </p>
          <div className={styles.applicationBox}>
            <ul>
              <li>Güncel CV</li>
              <li>Motivasyon Mektubu (İsteğe bağlı ama tavsiye edilir)</li>
              <li>Referanslar ve iletişim bilgileri</li>
              <li>Uygun başlangıç tarihi</li>
            </ul>
            <p>
              <strong>E-posta:</strong> <a href="mailto:careers@flux.com.tr">careers@flux.com.tr</a>
            </p>
            <p style={{ marginTop: '15px', fontSize: '0.95em', color: '#888' }}>
              Tüm başvurulara teşekkür ederiz. Başarılı adaylarla 5 iş günü içinde iletişime geçilecektir.
            </p>
          </div>
        </section>

        <section>
          <h2>Sıkça Sorulan Sorular</h2>
          <div className={styles.faqItem}>
            <h4>S: Mezun olmamdan ne kadar sonra başvuru yapabilirim?</h4>
            <p>C: Yaşadığınız tecrübe yeterli ise hemen başvuru yapabilirsiniz.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>S: Askerlik hizmetimi henüz yapmadım, başvuru yapabilir miyim?</h4>
            <p>C: Evet, ancak bu bilgiyi CV'ye yazmanız gerekir.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>S: Öğrenci olup internship yapabilir miyim?</h4>
            <p>C: Evet, yaz ve akademik dönem internship programları sunmaktayız. Detaylar için info@flux.com.tr ile iletişime geçin.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
