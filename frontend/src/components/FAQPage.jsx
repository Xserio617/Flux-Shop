import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: 'Ürünlerin garantisi ne kadar süreli?',
      answer: 'Tüm ürünlerimiz resmi üretici garantisi ile gelmektedir. Elektronik cihazlar genellikle 1-2 yıl garantiye sahiptir. Garantinin başlangıç tarihi ürünün faturadaki tarihinden itibaren başlar. Detaylı bilgi için ürün garantı kartını incelemenizi veya müşteri hizmetlerimizle iletişime geçmenizi öneriz.'
    },
    {
      question: 'Teslimat süresi ne kadar?',
      answer: 'İstanbul ve çevresine 1-2 gün içinde teslimat yapılmaktadır. Diğer şehirlere ise 3-5 gün içinde kargo ile gönderim sağlanmaktadır. Bazı bölgelere teslimat süresi 7 günü bulabilmektedir. Teslimat tarihi siparişin onaylanmasından sonra SMS ve e-posta ile iletilecektir.'
    },
    {
      question: 'Ürün iade ve değişim nasıl yapılır?',
      answer: 'Alınan ürün, faturası ve orijinal ambalajı ile birlikte 14 gün içinde iade edilebilir. Ürünün kutusu açılmamış ve hiç kullanılmamış olması gerekmektedir. İade talebinizi müşteri hizmetlerimize bildirdikten sonra kargo etiketi size gönderilecektir. İade onaylandıktan sonra ödemeniz 3-5 gün içinde iade edilecektir.'
    },
    {
      question: 'Ödeme yöntemleri nelerdir?',
      answer: 'Kredi kartı, banka kartı, havale, EFT ve kapıda ödeme seçenekleriyle ödeme yapabilirsiniz. Kredi kartıyla yapılan alışveriş anında işleme alınırken, havale ve EFT için ödemenizin banka tarafından onaylanması beklenir. Kapıda ödeme seçeneğinde ürün teslimat sırasında nakit olarak ödenebilir.'
    },
    {
      question: 'Ürün stokta yoksa ne olur?',
      answer: 'Stokta olmayan ürünler için siparişiniz kütüphanemize kaydedilir. Ürün stoğa girdiğinde size e-posta ve SMS ile bildirilir. Bu durumda ürünü önceden belirlenmiş fiyattan satın almaya devam edebilirsiniz. Stoklanmayan ürünler için ödemeniz alınmaz.'
    },
    {
      question: 'Bilgisayar ve yazılım kurulumu yapılır mı?',
      answer: 'Evet, belirli ürünler için ücretli kurulum hizmeti sunulmaktadır. Bilgisayar kurulumu, yazılım yüklenmesi, sistemin ayarlanması gibi hizmetler mevcuttur. Detaylı bilgi için satın aldığınız ürünün sayfasında yer alan hizmetler kısmını kontrol edebilir veya müşteri temsilcimizle iletişime geçebilirsiniz.'
    },
    {
      question: 'Kırılan veya hasarlı ürün gelirse ne yapmalıyım?',
      answer: 'Eğer ürün hasar görmüş şekilde teslim alındıysa, teslimatı reddetme hakkınız vardır. Teslimatı aldıysanız ancak ürün hasar görmüşse, hemen foto ile müşteri hizmetlerimize bildir. Hasar tespit edilirse yeni ürün gönderilecek veya tam iade yapılacaktır. Hasar fotoğrafları mutlaka saklamanız gerekmektedir.'
    },
    {
      question: 'Satın aldığım ürünün fiyatı düştü, geri ödeme yapılır mı?',
      answer: 'Ürün satın aldıktan sonra 7 gün içinde fiyatı düşmüşse, fark iade edilir. Bunun için orijinal fatura ve ürün kutusunun korunması gerekmektedir. Talebinizi müşteri hizmetlerimize 7 günlük süre içinde bildirmeniz zorunludur. Promosyon ve indirimli fiyatlandırma için de aynı kural geçerlidir.'
    },
    {
      question: 'Toplu alışveriş için özel indirim var mı?',
      answer: 'Evet, 5 adetten fazla aynı ürün siparişi verenler için özel indirim sağlanmaktadır. Kurumsal ve toplu alışverişler için ayrıca esneklikli ödeme koşulları sunulmaktadır. Toplu alışveriş teklifi almak için müşteri hizmetlerimizle iletişime geçiniz. Siparişin boyutuna göre kargo da tamamen ücretsiz olabilir.'
    },
    {
      question: 'Ürünle ilgili teknik destek nasıl alırım?',
      answer: 'Tüm ürünlerimiz için teknik destek hizmeti sunulmaktadır. Sorunun niteliğine göre telefonla, e-posta ile veya canlı sohbet üzerinden destek alabilirsiniz. Ciddi teknik sorunlar için ayda 2 kez ücretsiz servis çıkışı yapılmaktadır. Garantisi içinde olan ürünler için onarım ve bakım hizmeti tamamen ücretsizdir.'
    },
    {
      question: 'Üyelik avantajları nelerdir?',
      answer: 'Siteye üye olduktan sonra her alışverişte %5 indirim kazanırsınız. Ayrıca özel üye fiyatlarından yararlanabilir, ürünleri favorilere kaydedebilir ve sipariş geçmişinizi görebilirsiniz. Üyeliler için özel günlerde ek indirimler ve erken erişim sağlanır. Davet edilen arkadaşlarınızın ilk alışverişinde de indirim alabilirsiniz.'
    },
    {
      question: 'Ürün inceleme ve puanlamalar güvenilir mi?',
      answer: 'Evet, tüm incelemeler gerçek müşteriler tarafından yapılmaktadır. Ürün satın alan müşteriler tarafından yazılan incelemelerin ve puanlamaların doğruluğu kontrol edilmektedir. Spam ve hileli incelemeler siteden kaldırılmaktadır. İncelemeniz yayınlanmadan önce moderatörlerimiz tarafından kontrol edilir.'
    },
    {
      question: 'Fatura ve faturasız satış yapılır mı?',
      answer: 'Tüm satışlarımızda resmi fatura kesilmektedir. İstiyor musunuz vergi mükellefi ad ve KDV numarası altında fatura düzenlemesi yapabiliriz. Fatura bireysel müşteri tarafından talep edilebilir. E-fatura sistemi ile fatura dijital olarak da alınabilir. Ticari lisans numarası ile kurumsal satın alımlar için özel fatura türü hazırlanır.'
    },
    {
      question: 'Canlı destek hattı kaça kadar açık?',
      answer: 'Müşteri hizmetlerimiz Pazartesi-Cumartesi saat 09:00-20:00 arası hizmet vermektedir. Pazar günleri 10:00-18:00 arası açık bulunmaktadır. Resmi tatil günlerinde kapalıdır. Mesai saatleri dışında gelen mesajlar ilk iş günü cevaplanacaktır. Acil sorunlar için WhatsApp üzerinden de iletişim kurabilirsiniz.'
    },
    {
      question: 'Ürün kişiselleştirmesi (oyma, yazdırma) yapılır mı?',
      answer: 'Bazı ürünler için kişiselleştirme hizmeti sunulmaktadır. Bilgisayarlar, tabletler ve bazı aksesuarlar oyulabilir veya yazdırılabilir. Kişiselleştirme için ürünün satış sayfasında ilgili seçenek bulunacaktır. Özel taleplerin fiyatı ürünün türüne göre değişir ve satın almadan önce teyit edilir.'
    }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* BAŞLIK BÖLÜMÜ */}
      <div style={{ 
        backgroundColor: 'var(--surface-color)', 
        borderBottom: '2px solid var(--primary-color)',
        padding: '40px 10%',
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'var(--secondary-color)', marginBottom: '10px', fontSize: '36px' }}>
          Sıkça Sorulan Sorular
        </h1>
        <p style={{ color: 'var(--text-light)', fontSize: '16px' }}>
          Satın almadan önce bilmen gereken her şey burada
        </p>
      </div>

      {/* SSS BÖLÜMÜ */}
      <div style={{ padding: '40px 10%', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s ease'
              }}
            >
              {/* SORU BAŞLIĞI */}
              <button
                onClick={() => toggleExpand(index)}
                style={{
                  width: '100%',
                  padding: '20px',
                  backgroundColor: expandedIndex === index ? 'var(--primary-color)' : 'var(--surface-color)',
                  color: expandedIndex === index ? 'white' : 'var(--text-color)',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (expandedIndex !== index) {
                    e.target.style.backgroundColor = 'var(--background-color)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (expandedIndex !== index) {
                    e.target.style.backgroundColor = 'var(--surface-color)';
                  }
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>❓</span>
                  {faq.question}
                </span>
                <span
                  style={{
                    transform: expandedIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '20px'
                  }}
                >
                  ⬇️
                </span>
              </button>

              {/* CEVAP BÖLÜMÜ */}
              {expandedIndex === index && (
                <div
                  style={{
                    padding: '20px',
                    backgroundColor: 'var(--background-color)',
                    borderTop: '1px solid var(--border-color)',
                    lineHeight: '1.8',
                    fontSize: '15px',
                    color: 'var(--text-light)',
                    animation: 'fadeIn 0.3s ease'
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BÖLÜM AYIRICI */}
      <div style={{
        margin: '40px 10%',
        height: '1px',
        backgroundColor: 'var(--border-color)'
      }}></div>

      {/* ÜRÜN KATALOĞU BÖLÜMÜ */}
      <div style={{
        padding: '40px 10%',
        backgroundColor: 'var(--surface-color)',
        borderRadius: '10px',
        margin: '0 10%',
        textAlign: 'center'
      }}>
        <h2 style={{ color: 'var(--secondary-color)', marginBottom: '15px' }}>
          Aradığın ürünü bulamadın mı?
        </h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
          Tüm ürünlerimizi keşfet ve en iyi fiyatlardan yararlan
        </p>
        <Link to="/">
          <button
            className="btn-primary"
            style={{
              padding: '12px 30px',
              fontSize: '16px'
            }}
          >
            ÜRÜNLERI GÖRÜNTÜLE →
          </button>
        </Link>
      </div>

      {/* İLETİŞİM BÖLÜMÜ */}
      <div style={{
        padding: '40px 10%',
        marginTop: '40px'
      }}>
        <div style={{
          backgroundColor: 'var(--surface-color)',
          padding: '30px',
          borderRadius: '10px',
          border: '2px solid var(--primary-color)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'var(--secondary-color)', marginBottom: '20px' }}>
            Hâlâ Sorun mu Var?
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '20px', fontSize: '15px' }}>
            Müşteri hizmetlerimiz 09:00 - 18:00 saatleri arasında sizin hizmetinizdedir.
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: '25px'
          }}>
            <div style={{
              flex: 1,
              minWidth: '200px',
              padding: '15px',
              backgroundColor: 'var(--background-color)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>📞</div>
              <div style={{ fontWeight: '600', marginBottom: '5px', color: 'var(--text-color)' }}>Telefon</div>
              <div style={{ color: 'var(--primary-color)', fontWeight: '700' }}>+90 (850) 123 45 67</div>
            </div>
            <div style={{
              flex: 1,
              minWidth: '200px',
              padding: '15px',
              backgroundColor: 'var(--background-color)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>✉️</div>
              <div style={{ fontWeight: '600', marginBottom: '5px', color: 'var(--text-color)' }}>E-posta</div>
              <div style={{ color: 'var(--primary-color)', fontWeight: '700' }}>destek@flux.com</div>
            </div>
            <div style={{
              flex: 1,
              minWidth: '200px',
              padding: '15px',
              backgroundColor: 'var(--background-color)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>💬</div>
              <div style={{ fontWeight: '600', marginBottom: '5px', color: 'var(--text-color)' }}>Canlı Sohbet</div>
              <div style={{ color: 'var(--primary-color)', fontWeight: '700' }}>Şu anda Açık</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS İÇİN ANIMASYON */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              max-height: 0;
            }
            to {
              opacity: 1;
              max-height: 500px;
            }
          }
        `}
      </style>
    </div>
  );
}
