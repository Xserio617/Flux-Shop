import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { calculateDiscount } from '../utils/priceHelper';
import LocationPicker from './LocationPicker';
import { API_URL } from '../utils/api';

export default function CheckoutPage() {
  const { cart, clearCart, appliedCoupon } = useCart();
  const navigate = useNavigate();
  
  // Auth kontrolü
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  
  // Taksit State'leri
  const [installments, setInstallments] = useState([]);
  const [selectedInstallment, setSelectedInstallment] = useState(1);
  const [loadingInstallments, setLoadingInstallments] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);
  
  // Ara Toplam (Ürün indirimleri uygulanmış)
  const subTotal = cart.reduce((total, item) => {
    const { finalPrice } = calculateDiscount(item);
    return total + (parseFloat(finalPrice) * item.quantity);
  }, 0);

  // Kupon İndirimi Hesaplama
  let couponDiscount = (subTotal * appliedCoupon.discountRate) / 100;
  if (appliedCoupon.maxDiscountAmount && couponDiscount > appliedCoupon.maxDiscountAmount) {
    couponDiscount = parseFloat(appliedCoupon.maxDiscountAmount);
  }

  // Baz Toplam (kupon indirimi uygulanmış)
  const baseTotal = subTotal - couponDiscount;
  
  // Taksit komisyonu hesaplama
  const selectedInstallmentData = installments.find(i => i.installment_number === selectedInstallment);
  const finalTotal = selectedInstallmentData ? selectedInstallmentData.total_price : baseTotal;
  const commissionAmount = finalTotal - baseTotal;

  // Form State'i (Tarih ve CVC eklendi)
  const [form, setForm] = useState({ 
      name: '', 
      address: '', 
      card: '', 
      expiry: '', 
      cvc: '' 
  });

  // Kart numarası değiştiğinde taksit oranlarını getir
  const fetchInstallments = async (cardNumber) => {
    const binNumber = cardNumber.replace(/\s/g, '').substring(0, 6);
    if (binNumber.length < 6) {
      setInstallments([]);
      return;
    }
    
    setLoadingInstallments(true);
    try {
      const response = await fetch(`${API_URL}/payment/installments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bin_number: binNumber, 
          price: baseTotal.toFixed(2) 
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setInstallments(data.installments);
        setSelectedInstallment(1); // Varsayılan tek çekim
      }
    } catch (error) {
      console.error('Taksit bilgisi alınamadı:', error);
    }
    setLoadingInstallments(false);
  };

  // --- FORMATLAMA FONKSİYONLARI (Yazarken Düzelten) ---

  const handleCardNumber = (e) => {
      let val = e.target.value.replace(/\D/g, ''); // Sadece rakamları al
      val = val.substring(0, 16); // Max 16 rakam
      // 4 hanede bir boşluk ekle
      val = val.replace(/(\d{4})/g, '$1 ').trim();
      setForm({ ...form, card: val });
      
      // 6+ hane girildiğinde taksit oranlarını getir
      if (val.replace(/\s/g, '').length >= 6) {
        fetchInstallments(val);
      }
  };

  const handleExpiry = (e) => {
      let val = e.target.value.replace(/\D/g, ''); // Sadece rakam
      val = val.substring(0, 4); // Max 4 rakam (AAYY)
      
      if (val.length >= 2) {
          val = val.substring(0, 2) + '/' + val.substring(2);
      }
      setForm({ ...form, expiry: val });
  };

  const handleCVC = (e) => {
      let val = e.target.value.replace(/\D/g, ''); // Sadece rakam
      val = val.substring(0, 3); // Max 3 rakam
      setForm({ ...form, cvc: val });
  };

  // Haritadan seçilen lokasyonları form'a uygulamak
  const handleLocationSelect = (location) => {
      if (location.address) {
          setForm({ ...form, address: location.address });
          setMapOpen(false);
          toast.success("Adres güncellendi!");
      }
  };

  // --- ÖDEME İŞLEMİ VE VALIDASYON ---
  
  const handlePayment = async (e) => {
    e.preventDefault();

    // 1. Basit Boşluk Kontrolü
    if(!form.name || !form.address || !form.card || !form.expiry || !form.cvc) {
        toast.warn("Lütfen tüm alanları doldurun!");
        return;
    }

    // 2. Kart Numarası Kontrolü (Boşluksuz 16 hane olmalı)
    const rawCard = form.card.replace(/\s/g, '');
    if (rawCard.length < 16) {
        toast.error("Kart numarası eksik! 16 hane olmalı.");
        return;
    }

    // 3. Tarih Kontrolü (5 karakter olmalı: AA/YY)
    if (form.expiry.length < 5) {
        toast.error("Son kullanma tarihi hatalı! (AA/YY)");
        return;
    }

    // 3.1. Tarih Geçerlilik Kontrolü (Geçmiş tarih mi?)
    const [expMonth, expYear] = form.expiry.split('/');
    const expMonthNum = parseInt(expMonth, 10);
    const expYearNum = parseInt('20' + expYear, 10); // YY -> 20YY
    
    // Ay kontrolü (01-12 arası olmalı)
    if (expMonthNum < 1 || expMonthNum > 12) {
        toast.error("Geçersiz ay! (01-12 arası olmalı)");
        return;
    }
    
    // Geçmiş tarih kontrolü
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 0-indexed
    const currentYear = now.getFullYear();
    
    if (expYearNum < currentYear || (expYearNum === currentYear && expMonthNum < currentMonth)) {
        toast.error("Kartınızın son kullanma tarihi geçmiş!");
        return;
    }

    // 4. CVC Kontrolü (3 hane)
    if (form.cvc.length < 3) {
        toast.error("CVC kodu 3 haneli olmalıdır.");
        return;
    }

    // --- HER ŞEY TAMAMSA ÖDEME İŞLEMİ BAŞLASIN ---

    const confirmBtn = document.getElementById('pay-btn');
    confirmBtn.innerText = "Ödeme işleniyor...";
    confirmBtn.disabled = true;
    confirmBtn.style.backgroundColor = "#555"; // Gri yap

    const token = localStorage.getItem('accessToken');
    
    try {
        // Tarih parçalama (AA/YY formatından)
        const [expireMonth, expireYear] = form.expiry.split('/');
        const fullYear = '20' + expireYear; // YY -> 20YY
        
        // İsim parçalama
        const nameParts = form.name.trim().split(' ');
        const firstName = nameParts[0] || 'Ad';
        const lastName = nameParts.slice(1).join(' ') || 'Soyad';
        
        // Sepet ürünlerini API formatına çevir
        const items = cart.map(item => {
            const { finalPrice } = calculateDiscount(item);
            return {
                id: item.id,
                name: item.name,
                price: (parseFloat(finalPrice) * item.quantity).toFixed(2),
                quantity: item.quantity
            };
        });
        
        // Ödeme API'sine gönderilecek veri
        const paymentData = {
            card_holder: form.name,
            card_number: rawCard,
            expire_month: expireMonth,
            expire_year: fullYear,
            cvc: form.cvc,
            name: firstName,
            surname: lastName,
            address: form.address,
            city: 'Istanbul',
            phone: '+905350000000',
            items: items,
            total_price: baseTotal.toFixed(2),
            paid_price: finalTotal.toFixed(2),  // Komisyonlu tutar
            installment: selectedInstallment,    // Taksit sayısı
            coupon_code: appliedCoupon.code || null
        };
        
        // Ödeme API'sini çağır
        const response = await fetch(`${API_URL}/payment/process/`, {
            method: 'POST',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // Siparişi veritabanına kaydet
            if (token) {
                try {
                    const items_data = cart.map(item => {
                        const { finalPrice } = calculateDiscount(item);
                        return {
                            product: item.id,
                            quantity: item.quantity,
                            price: parseFloat(finalPrice),
                        };
                    });
                    
                    const orderData = {
                        order_number: result.order_number,
                        total_price: finalTotal,  // Komisyonlu tutar
                        customer_name: form.name,
                        delivery_address: form.address,
                        status: 'processing',
                        items_data: items_data,
                    };

                    await fetch(`${API_URL}/orders/`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(orderData),
                    });
                } catch (error) {
                    console.error('Sipariş kaydetme hatası:', error);
                }
            }
            
            clearCart();
            
            // Demo mod uyarısı
            if (result.demo_mode) {
                toast.info("Demo Mod: Gerçek ödeme alınmadı");
            }
            
            navigate('/success', { state: { orderId: result.order_number } });
            toast.success("Ödeme Onaylandı! 🎉");
        } else {
            // Ödeme başarısız
            confirmBtn.innerText = `${finalTotal.toFixed(2)} TL ÖDE`;
            confirmBtn.disabled = false;
            confirmBtn.style.backgroundColor = "";
            toast.error(result.message || "Ödeme başarısız!");
        }
        
    } catch (error) {
        console.error('Ödeme hatası:', error);
        confirmBtn.innerText = `${finalTotal.toFixed(2)} TL ÖDE`;
        confirmBtn.disabled = false;
        confirmBtn.style.backgroundColor = "";
        toast.error("Ödeme sırasında bir hata oluştu!");
    }
  };

  if (cart.length === 0) return <div style={{textAlign:'center', padding:'50px', color: 'var(--text-color)', backgroundColor: 'var(--background-color)', minHeight: '80vh'}}>Sepetiniz Boş!</div>;

  // Ortak Input Stili
  const inputStyle = {
      width: '100%', 
      padding: '12px', 
      border: '1px solid var(--border-color)', 
      borderRadius: '8px',
      backgroundColor: 'var(--background-color)', 
      color: 'var(--text-color)',
      outline: 'none',
      fontSize: '15px'
  };

  return (
    <div style={{ padding: '40px 10%', backgroundColor: 'var(--background-color)', minHeight: '80vh', color: 'var(--text-color)' }}>
      <h1 style={{ color: 'var(--secondary-color)', marginBottom: '30px' }}>Ödeme Ekranı</h1>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* SOL: FORM ALANI */}
        <div style={{ flex: 2, backgroundColor: 'var(--surface-color)', padding: '30px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--text-color)' }}>Kart Bilgileri</h3>
            <form onSubmit={handlePayment}>
                
                {/* Ad Soyad */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{color: 'var(--text-color)', display: 'block', marginBottom: '5px', fontSize:'13px'}}>Kart Üzerindeki İsim</label>
                    <input 
                        type="text" 
                        placeholder="Ad Soyad"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        style={inputStyle} 
                    />
                </div>

                {/* Kart Numarası */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{color: 'var(--text-color)', display: 'block', marginBottom: '5px', fontSize:'13px'}}>Kart Numarası</label>
                    <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        value={form.card}
                        onChange={handleCardNumber} // Özel fonksiyon
                        maxLength="19" // Boşluklar dahil
                        style={{...inputStyle, letterSpacing: '2px', fontFamily: 'monospace'}} 
                    />
                </div>

                {/* Tarih ve CVC (Yan Yana) */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{color: 'var(--text-color)', display: 'block', marginBottom: '5px', fontSize:'13px'}}>Son Kullanma (AA/YY)</label>
                        <input 
                            type="text" 
                            placeholder="MM/YY" 
                            value={form.expiry}
                            onChange={handleExpiry} // Özel fonksiyon
                            maxLength="5"
                            style={{...inputStyle, textAlign: 'center'}} 
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{color: 'var(--text-color)', display: 'block', marginBottom: '5px', fontSize:'13px'}}>CVC / CVV</label>
                        <input 
                            type="text" 
                            placeholder="123" 
                            value={form.cvc}
                            onChange={handleCVC} // Özel fonksiyon
                            maxLength="3"
                            style={{...inputStyle, textAlign: 'center'}} 
                        />
                    </div>
                </div>

                {/* Adres (Alta kaydırdık) */}
                <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <label style={{color: 'var(--text-color)', display: 'block', marginBottom: '5px', fontSize:'13px'}}>Teslimat Adresi</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <textarea 
                            rows="3" 
                            placeholder="Açık adresinizi giriniz..."
                            value={form.address}
                            onChange={(e) => setForm({...form, address: e.target.value})}
                            style={{...inputStyle, flex: 1}}
                        ></textarea>
                        <button
                            type="button"
                            onClick={() => {
                                if (!isLoggedIn) {
                                    toast.warn("Lütfen önce giriş yapınız!");
                                    navigate('/auth');
                                    return;
                                }
                                setMapOpen(true);
                            }}
                            style={{
                                padding: '12px 16px',
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                whiteSpace: 'nowrap',
                                height: 'fit-content',
                                marginTop: '2px'
                            }}
                        >
                            📍 Konumumu Seç
                        </button>
                    </div>
                </div>

                {/* TAKSİT SEÇİMİ */}
                {installments.length > 0 && (
                    <div style={{ marginTop: '20px', marginBottom: '15px' }}>
                        <label style={{color: 'var(--text-color)', display: 'block', marginBottom: '10px', fontSize:'14px', fontWeight: '600'}}>
                            💳 Taksit Seçenekleri
                        </label>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                            gap: '10px' 
                        }}>
                            {installments.map((inst) => (
                                <div
                                    key={inst.installment_number}
                                    onClick={() => setSelectedInstallment(inst.installment_number)}
                                    style={{
                                        padding: '12px',
                                        border: selectedInstallment === inst.installment_number 
                                            ? '2px solid var(--primary-color)' 
                                            : '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: selectedInstallment === inst.installment_number 
                                            ? 'rgba(108, 99, 255, 0.1)' 
                                            : 'var(--surface-color)',
                                        textAlign: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', color: 'var(--text-color)', fontSize: '15px' }}>
                                        {inst.installment_number === 1 ? 'Tek Çekim' : `${inst.installment_number} Taksit`}
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '4px' }}>
                                        {inst.installment_price.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL/ay
                                    </div>
                                    {inst.commission_rate > 0 && (
                                        <div style={{ fontSize: '11px', color: '#f97316', marginTop: '2px' }}>
                                            +%{inst.commission_rate} komisyon
                                        </div>
                                    )}
                                    <div style={{ fontSize: '12px', color: 'var(--primary-color)', marginTop: '4px', fontWeight: '600' }}>
                                        Toplam: {inst.total_price.toLocaleString('tr-TR', {minimumFractionDigits: 2})} TL
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {loadingInstallments && (
                    <div style={{ textAlign: 'center', padding: '15px', color: 'var(--text-light)' }}>
                        Taksit seçenekleri yükleniyor...
                    </div>
                )}

                <button id="pay-btn" type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '18px', marginTop: '10px' }}>
                    {selectedInstallment > 1 
                        ? `${selectedInstallment} Taksit - ${finalTotal.toFixed(2)} TL ÖDE`
                        : `${finalTotal.toFixed(2)} TL ÖDE`
                    }
                </button>
            </form>
        </div>

        {/* SAĞ: ÖZET */}
        <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ backgroundColor: 'var(--surface-color)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h4 style={{color: 'var(--text-color)'}}>Sipariş Özeti</h4>
                <hr style={{ margin: '10px 0', border: '0', borderTop: '1px solid var(--border-color)' }} />
                {cart.map(item => {
                    const { finalPrice } = calculateDiscount(item);
                    return (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: 'var(--text-color)' }}>
                            <span>{item.name} (x{item.quantity})</span>
                            <span style={{ fontWeight: 'bold' }}>{(parseFloat(finalPrice) * item.quantity).toFixed(2)} TL</span>
                        </div>
                    );
                })}
                <hr style={{ margin: '10px 0', border: '0', borderTop: '1px solid var(--border-color)' }} />
                
                {/* Ara Toplam */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-light)' }}>
                    <span>Ara Toplam:</span>
                    <span>{subTotal.toFixed(2)} TL</span>
                </div>
                
                {/* Kupon İndirimi (varsa) */}
                {appliedCoupon.discountRate > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#22c55e' }}>
                        <span>Kupon İndirimi (%{appliedCoupon.discountRate}):</span>
                        <span>-{couponDiscount.toFixed(2)} TL</span>
                    </div>
                )}
                
                {/* Taksit Komisyonu (varsa) */}
                {commissionAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#f97316' }}>
                        <span>Taksit Komisyonu ({selectedInstallment} taksit):</span>
                        <span>+{commissionAmount.toFixed(2)} TL</span>
                    </div>
                )}
                
                <hr style={{ margin: '10px 0', border: '0', borderTop: '1px solid var(--border-color)' }} />
                
                {/* Final Toplam */}
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)', textAlign: 'right' }}>
                    {finalTotal.toFixed(2)} TL
                </div>
                
                {/* Taksit bilgisi */}
                {selectedInstallment > 1 && selectedInstallmentData && (
                    <div style={{ fontSize: '13px', color: 'var(--text-light)', textAlign: 'right', marginTop: '5px' }}>
                        {selectedInstallment} x {selectedInstallmentData.installment_price.toFixed(2)} TL
                    </div>
                )}
            </div>
        </div>

      </div>

      {/* LocationPicker Modal */}
      <LocationPicker 
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  )
}
