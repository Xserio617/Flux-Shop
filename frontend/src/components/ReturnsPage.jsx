import React from 'react';
import styles from './ReturnsPage.module.css';

export default function ReturnsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>İade ve Değişim Politikası</h1>
        
        <section>
          <h2>Hoş Geldiniz</h2>
          <p>
            FLUX Teknoloji olarak müşteri memnuniyeti bizim için en önemli önceliktir. 
            Satın aldığınız ürünlerle ilgili herhangi bir sorun yaşarsanız veya değişim 
            yaplamak istiyorsanız, bu politika sizin haklarınızı ve prosedürümüzü açıklamaktadır.
          </p>
        </section>

        <section>
          <h2>30 Gün Para İade Garantisi</h2>
          <p>
            Satın aldığınız ürünlerden memnun değilseniz, <strong>satın alma tarihinden 
            itibaren 30 gün içinde</strong> ürünü bize geri gönderebilir ve tam ödemenizi 
            geri alabilirsiniz. Şartlar:
          </p>
          <ul>
            <li>Ürün orijinal, kullanılmamış ve hasarsız durumda olmalıdır</li>
            <li>Orijinal ambalajda ve tüm aksesuarlarıyla bulunması gerekir</li>
            <li>Ürün tanıtım malzemeleri ve garantisi ekli olmalıdır</li>
            <li>Fatura veya satın alma belgesi bulunmalıdır</li>
          </ul>
        </section>

        <section>
          <h2>Değişim Hakkı</h2>
          <p>
            Satın aldığınız ürünle ilgili sorun yaşarsanız veya başka bir modele değiştirmek 
            istiyorsanız, satın alma tarihinden itibaren <strong>30 gün içinde</strong> 
            aşağıdaki koşullarla değişim yapabilirsiniz:
          </p>
          <ul>
            <li>Ürün kullanılmamış olmalıdır</li>
            <li>Ambalajı açılmamış ve orijinal durumda olmalıdır</li>
            <li>Değişim aynı fiyat aralığında bir ürünle yapılabilir</li>
            <li>Fiyat farkı varsa, müşteri farkı ödeyebilir veya iade alabilir</li>
          </ul>
        </section>

        <section>
          <h2>Kusurlu veya Hasarlı Ürün</h2>
          <p>
            Eğer ürün kusurlu, hasarlı veya eksik parçalarla gelmişse:
          </p>
          <ul>
            <li>Teslimat tarihinden itibaren <strong>7 gün içinde</strong> talep yapabilirsiniz</li>
            <li>Fotoğraf ve video kanıtı sağlanmalıdır</li>
            <li>Müşteri hizmeti ekibimiz ürünü inceleme yapacak</li>
            <li>Onaylandığı takdirde, ürün bedeli tamamen iade edilir veya değiştirilir</li>
            <li>Kargo ücretini FLUX karşılar</li>
          </ul>
        </section>

        <section>
          <h2>İade Prosedürü</h2>
          <p>İade yapmak istiyorsanız, aşağıdaki adımları izleyin:</p>
          <ol>
            <li>
              <strong>Adım 1:</strong> İade talebini yapın: 
              <br />info@flux.com.tr adresine sipariş numaranız ve iade sebebini yazıp gönderin
            </li>
            <li>
              <strong>Adım 2:</strong> Talep Onayı: 
              <br />Takımımız 24 saat içinde talebinizi inceleyip onaylayacaktır
            </li>
            <li>
              <strong>Adım 3:</strong> Kargo Etiketi: 
              <br />Onaylandıktan sonra, size kargo etiketi göndereceğiz
            </li>
            <li>
              <strong>Adım 4:</strong> Ürünü Gönder: 
              <br />Ürünü orijinal ambalajıyla paketleyip, verilen etiketi yapıştırarak gönder
            </li>
            <li>
              <strong>Adım 5:</strong> İşleme al: 
              <br />Ürün bize ulaştıktan sonra 5-7 iş günü içinde incelenerek işlem yapılacak
            </li>
            <li>
              <strong>Adım 6:</strong> Para İade: 
              <br />Onaylandıktan sonra 3-5 iş günü içinde hesabınıza para iade edilecek
            </li>
          </ol>
        </section>

        <section>
          <h2>Değişim Prosedürü</h2>
          <ol>
            <li>
              <strong>Adım 1:</strong> Değişim Talebini Yap: 
              <br />info@flux.com.tr'ye sipariş numanız ve yeni ürünü belirterek yazın
            </li>
            <li>
              <strong>Adım 2:</strong> Onay ve Stok Kontrolü: 
              <br />Takımımız 24 saat içinde talebinizi onaylayacak ve yeni ürünün stoğunu kontrol edecek
            </li>
            <li>
              <strong>Adım 3:</strong> Kargo İşlemi: 
              <br />Sizden kargo etiketi alacak ve yeni ürün gönderilecek
            </li>
            <li>
              <strong>Adım 4:</strong> Yeni Ürün Teslimatı: 
              <br />Eski ürün bize ulaştıktan sonra, yeni ürün gönderilecek
            </li>
          </ol>
        </section>

        <section>
          <h2>Para İade Zamanı</h2>
          <ul>
            <li>Ürün bize ulaştıktan sonra: 5-7 iş günü</li>
            <li>Ürün incelendikten sonra: 3-5 iş günü</li>
            <li><strong>Toplam Bekleme Süresi:</strong> 10-15 iş günü</li>
            <li>Para iadesi, orijinal ödeme yöntemine yapılır</li>
          </ul>
        </section>

        <section>
          <h2>İade Edilemeyecek Ürünler</h2>
          <p>Aşağıdaki durumlarda para iadesi yapılmayacaktır:</p>
          <ul>
            <li>Ürün kullanılmışsa veya yoğun kullanım izleri varsa</li>
            <li>Orijinal ambalajı açılmışsa (açılmamış olması durumunda)</li>
            <li>Aksesuarlar veya belgeler eksikse</li>
            <li>Ürün fiziksel hasara uğramışsa</li>
            <li>Garanti kapsamı dışında bir sorun varsa</li>
            <li>İade süresi 30 günü aştıysa</li>
            <li>Kargo ücretini müşteri ödemiş ama ürün hasarlıysa, kargo ücretini geri alır</li>
          </ul>
        </section>

        <section>
          <h2>Sık Sorulan Sorular</h2>
          <div className={styles.faqItem}>
            <h4>S: Açılmış ürünü iade edebilir miyim?</h4>
            <p>
              C: Hayır, ürün açılmamış olmalıdır. Eğer ürün açılmışsa ancak kullanılmamışsa, 
              incelendikten sonra karar verilir.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h4>S: Kargo ücretini kim öder?</h4>
            <p>
              C: Kusurlu/hasarlı ürünlerde FLUX ücret öder. Normal iadede müşteri öder, 
              ancak iade onaylandıktan sonra kargo etiketi biz sağlarız.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h4>S: Kredi kartıyla ödeme yaptım, para nasıl geri alır?</h4>
            <p>
              C: Para, 3-5 iş günü içinde orijinal kartınıza iade edilir. 
              Banka tarafından işleme alınması 7-10 gün alabilir.
            </p>
          </div>
        </section>

        <section>
          <h2>İletişim</h2>
          <p>İade veya değişim konusunda sorularınız varsa, bize ulaşın:</p>
          <ul>
            <li><strong>E-posta:</strong> returns@flux.com.tr</li>
            <li><strong>Canlı Sohbet:</strong> Web sitemizden 09:00-18:00 arası</li>
            <li><strong>Telefon:</strong> +90 (212) 555-0001</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
