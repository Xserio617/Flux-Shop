import React from 'react';
import styles from './PrivacyPage.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Gizlilik Politikası</h1>
        
        <section>
          <h2>1. Giriş</h2>
          <p>
            FLUX Teknoloji (bu belgenin amacında "Biz", "Bize", "Bizim" ve "FLUX") sizin gizliliğinize 
            saygı duymaktadır. Bu Gizlilik Politikası, web sitemiz (www.flux.com.tr) aracılığıyla 
            topladığımız kişisel verilerinizin nasıl toplanıp, kullanıldığını ve korunduğunu açıklamaktadır.
          </p>
        </section>

        <section>
          <h2>2. Topladığımız Veriler</h2>
          <p>Web sitemizi kullanırken aşağıdaki kişisel verileri toplayabiliriz:</p>
          <ul>
            <li><strong>Kimlik Bilgileri:</strong> Ad, soyadı, e-posta adresi, telefon numarası</li>
            <li><strong>Adres Bilgileri:</strong> Ev/İş adresi, şehir, posta kodu</li>
            <li><strong>Ödeme Bilgileri:</strong> Kredi kartı numarası, banka hesap bilgileri</li>
            <li><strong>Tarama Bilgileri:</strong> IP adresi, tarayıcı türü, ziyaret edilen sayfalar</li>
            <li><strong>Çerezler:</strong> İnternet tarafından otomatik olarak kaydedilen veriler</li>
            <li><strong>Ürün Tercihleriniz:</strong> İnceleme yaptığınız ürünler, sepete eklediğiniz ürünler</li>
          </ul>
        </section>

        <section>
          <h2>3. Verilerin Kullanım Amacı</h2>
          <p>Topladığımız kişisel verileriniz aşağıdaki amaçlar için kullanılmaktadır:</p>
          <ul>
            <li>Siparişlerinizi işlemek ve göndermenin tamamlanması</li>
            <li>Size hızlı ve etkili müşteri hizmetleri sağlamak</li>
            <li>Ürün ve hizmetlerimizi geliştirmek ve özelleştirmek</li>
            <li>Size promosyonlar ve özel teklifler sunmak (istemeniz durumunda)</li>
            <li>Dolandırıcılık ve kötüye kullanımı önlemek</li>
            <li>Yasal yükümlülüklerimizi yerine getirmek</li>
            <li>Analitik ve istatistik amaçlı verilerinizi toplama</li>
          </ul>
        </section>

        <section>
          <h2>4. Verilerin Korunması</h2>
          <p>
            Kişisel verilerinizin güvenliğini sağlamak için endüstri standardı güvenlik ölçüleri 
            (SSL şifreleme, güvenli sunucular, vb.) kullanmaktayız. Ancak internet üzerindeki 
            hiçbir iletişim %100 güvenli değildir ve verilerin tamamen korunması garantisi veremeyiz.
          </p>
        </section>

        <section>
          <h2>5. Üçüncü Taraflarla Veri Paylaşımı</h2>
          <p>
            Kişisel verilerinizi aşağıdaki durumlarda üçüncü taraflarla paylaşabiliriz:
          </p>
          <ul>
            <li>Ödeme işlemcileriniz (ödeme işlemi için)</li>
            <li>Kargo şirketleri (ürün gönderimi için)</li>
            <li>Pazarlama ortakları (promosyon amaçlı - istemeniz durumunda)</li>
            <li>Yasal zorunluluk durumunda yetkili mercilere</li>
            <li>İş ortakları ve danışmanlar (verilerinizi koruma altında)</li>
          </ul>
        </section>

        <section>
          <h2>6. Haklarınız</h2>
          <p>KVKK (Kişisel Verilerin Korunması Kanunu) uyarınca aşağıdaki haklara sahipsiniz:</p>
          <ul>
            <li>Kişisel verilerinize erişme hakkı</li>
            <li>Kişisel verilerinizi düzeltme hakkı</li>
            <li>Kişisel verileriniz silinmesini isteme hakkı</li>
            <li>Verilerinizin işlenmesine itiraz etme hakkı</li>
            <li>Verilerinizin aktarılabilirliğini talep etme hakkı</li>
            <li>Verilerinizin sınırlandırılmış işlenmesini talep etme hakkı</li>
          </ul>
          <p>
            Bu haklarınız hakkında daha fazla bilgi için bize <strong>privacy@flux.com.tr</strong> 
            adresinden iletişime geçebilirsiniz.
          </p>
        </section>

        <section>
          <h2>7. Çerezler (Cookies)</h2>
          <p>
            Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. 
            Çerezleri tarayıcı ayarlarınızdan devre dışı bırakabilirsiniz, ancak bu durum 
            site işlevselliğini etkileyebilir.
          </p>
        </section>

        <section>
          <h2>8. İletişim Bilgileri</h2>
          <p>
            Gizliliğiniz hakkında sorularınız varsa veya verilerinizle ilgili talep bulunuyorsanız, 
            lütfen bize ulaşın:
          </p>
          <ul>
            <li><strong>E-posta:</strong> privacy@flux.com.tr</li>
            <li><strong>Adres:</strong> FLUX Teknoloji A.Ş., İstanbul, Türkiye</li>
            <li><strong>Telefon:</strong> +90 (212) 555-0001</li>
          </ul>
        </section>

        <section>
          <h2>9. Son Güncelleme</h2>
          <p>
            Bu Gizlilik Politikası son olarak 25 Kasım 2025 tarihinde güncellenmiştir. 
            Politikada yapılan değişiklikler web sitemize yayımlanır ve derhal yürürlüğe girer.
          </p>
        </section>
      </div>
    </div>
  );
}
