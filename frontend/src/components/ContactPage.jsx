import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Form verilerini doğrula
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        toast.warning('Lütfen tüm alanları doldurunuz!');
        setIsLoading(false);
        return;
      }

      // Burada normalde bir API'ye post edebilirsiniz
      // const response = await axios.post('/api/contact/', formData);
      
      // Şimdilik demo amaçlı başarılı mesajı gösteririz
      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ color: 'var(--primary-color, #333)', marginBottom: '30px', fontSize: '2.2em' }}>
          İletişim
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          {/* İletişim Bilgileri */}
          <section>
            <h2 style={{ color: 'var(--primary-color, #333)', marginBottom: '20px', fontSize: '1.5em' }}>
              Bize Ulaşın
            </h2>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--primary-color, #333)', marginBottom: '10px' }}>📧 E-Posta</h3>
              <p style={{ color: '#555', margin: 0 }}>
                <strong>Genel Sorular:</strong> info@flux.com.tr<br />
                <strong>Müşteri Destek:</strong> support@flux.com.tr<br />
                <strong>İade/Değişim:</strong> returns@flux.com.tr<br />
                <strong>Gizlilik:</strong> privacy@flux.com.tr<br />
                <strong>Kariyer:</strong> careers@flux.com.tr
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--primary-color, #333)', marginBottom: '10px' }}>📱 Telefon</h3>
              <p style={{ color: '#555', margin: 0 }}>
                <strong>Müşteri Hizmetleri:</strong> +90 (212) 555-0001<br />
                <strong>Pazarlama:</strong> +90 (212) 555-0002<br />
                <strong>Teknik Destek:</strong> +90 (212) 555-0003
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--primary-color, #333)', marginBottom: '10px' }}>📍 Adres</h3>
              <p style={{ color: '#555', margin: 0 }}>
                FLUX Teknoloji A.Ş.<br />
                Beşiktaş Mah. Nizam Cd. No:45<br />
                34349 Beşiktaş, İstanbul<br />
                Türkiye
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--primary-color, #333)', marginBottom: '10px' }}>🕐 Çalışma Saatleri</h3>
              <p style={{ color: '#555', margin: 0 }}>
                Pazartesi - Cuma: 09:00 - 18:00<br />
                Cumartesi: 10:00 - 16:00<br />
                Pazar: Kapalı<br />
                <br />
                <strong>Tatil Günleri:</strong> Canlı destek kapalıdır, e-posta ile yazabilirsiniz.
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: 'var(--primary-color, #333)', marginBottom: '10px' }}>🌐 Sosyal Medya</h3>
              <p style={{ color: '#555', margin: 0 }}>
                <strong>Instagram:</strong> @fluxtech<br />
                <strong>Twitter:</strong> @fluxtech<br />
                <strong>YouTube:</strong> FLUX Teknoloji<br />
                <strong>Facebook:</strong> flux.teknoloji
              </p>
            </div>
          </section>

          {/* İletişim Formu */}
          <section>
            <h2 style={{ color: 'var(--primary-color, #333)', marginBottom: '20px', fontSize: '1.5em' }}>
              Bize Yazın
            </h2>
            <form onSubmit={handleSubmit} style={{
              backgroundColor: '#f5f5f5',
              padding: '25px',
              borderRadius: '8px'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                  İsminiz *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Adınız Soyadınız"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    fontSize: '1em'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                  E-posta *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@example.com"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    fontSize: '1em'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                  Telefon Numarası
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+90 (2XX) XXX-XXXX"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    fontSize: '1em'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                  Konu *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Mesajınızın konusu"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    fontSize: '1em'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>
                  Mesajınız *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mesajınızı yazınız..."
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    fontSize: '1em',
                    fontFamily: 'Arial, sans-serif',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: 'var(--primary-color, #333)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1em',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  transition: 'opacity 0.3s'
                }}
              >
                {isLoading ? 'Gönderiliyor...' : 'Gönder'}
              </button>

              <p style={{
                fontSize: '0.9em',
                color: '#888',
                marginTop: '10px',
                textAlign: 'center'
              }}>
                * Zorunlu alanlar
              </p>
            </form>
          </section>
        </div>

        {/* SSS */}
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ color: 'var(--primary-color, #333)', marginBottom: '20px', fontSize: '1.5em' }}>
            Sık Sorulan Sorular
          </h2>
          <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
            <h4 style={{ color: 'var(--primary-color, #333)', margin: '0 0 8px 0' }}>
              S: Kaç zamanda cevap alırım?
            </h4>
            <p style={{ color: '#555', margin: 0 }}>
              C: E-mail ile gönderilen sorulara 24 saat içinde, telefon ile çağrılan sorunlara ise anında yanıt verilir.
            </p>
          </div>

          <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
            <h4 style={{ color: 'var(--primary-color, #333)', margin: '0 0 8px 0' }}>
              S: Ürün hakkında teknik soru sormak istiyorum?
            </h4>
            <p style={{ color: '#555', margin: 0 }}>
              C: Teknik destek için support@flux.com.tr adresine yazabilir veya +90 (212) 555-0003 numarasını arayabilirsiniz.
            </p>
          </div>

          <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
            <h4 style={{ color: 'var(--primary-color, #333)', margin: '0 0 8px 0' }}>
              S: Haberlere ve kampanyalara nasıl abone olabilirim?
            </h4>
            <p style={{ color: '#555', margin: 0 }}>
              C: Web sitemizin alt kısmındaki "Newsletter" alanına e-mail adresinizi yazarak abone olabilirsiniz.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
