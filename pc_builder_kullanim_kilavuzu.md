# 🖥️ PC Topla Özelliği - Admin Kullanım Kılavuzu

Bu kılavuz, PC Topla özelliğini admin panelinden nasıl yapılandıracağınızı açıklar.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Parça Türlerini Ekleme](#1-parça-türlerini-ekleme)
3. [PC Parçalarını Ekleme](#2-pc-parçalarını-ekleme)
4. [Kullanıcı Build'lerini Yönetme](#3-kullanıcı-buildlerini-yönetme)
5. [Örnek Veri Seti](#örnek-veri-seti)

---

## Genel Bakış

PC Topla özelliği 4 ana modelden oluşur:

| Model | Açıklama |
|-------|----------|
| **ComponentType** | Parça türleri (İşlemci, Ekran Kartı, RAM vb.) |
| **PCComponent** | Her türe ait parçalar (Intel i7, RTX 4080 vb.) |
| **PCBuild** | Kullanıcının oluşturduğu yapılandırma |
| **PCBuildComponent** | Yapılandırmadaki parçalar |

---

## 1. Parça Türlerini Ekleme

Admin panelinde **Products → Component Types** bölümüne gidin.

### Önerilen Parça Türleri

Aşağıdaki türleri sırasıyla ekleyin:

| Sıra | İsim | Slug | İkon | Zorunlu |
|------|------|------|------|---------|
| 1 | İşlemci (CPU) | `islemci` | 🔲 | ✅ Evet |
| 2 | Anakart | `anakart` | 🔳 | ✅ Evet |
| 3 | Ekran Kartı (GPU) | `ekran-karti` | 🎮 | ✅ Evet |
| 4 | RAM | `ram` | 📊 | ✅ Evet |
| 5 | SSD / Depolama | `depolama` | 💾 | ✅ Evet |
| 6 | Güç Kaynağı (PSU) | `guc-kaynagi` | ⚡ | ✅ Evet |
| 7 | Kasa | `kasa` | 🖥️ | ✅ Evet |
| 8 | İşlemci Soğutucu | `sogutucu` | ❄️ | ❌ Hayır |
| 9 | Kasa Fanı | `fan` | 🌀 | ❌ Hayır |

### Ekleme Adımları

1. **Add Component Type** butonuna tıklayın
2. Alanları doldurun:
   - **Name**: Parça türünün adı (örn: "İşlemci (CPU)")
   - **Slug**: URL-uyumlu isim (örn: "islemci") - otomatik oluşur
   - **Icon**: Emoji veya ikon kodu
   - **Order**: Sıralama numarası (1'den başlayın)
   - **Is Required**: Zorunlu parça mı? (işaretleyin)
3. **Save** butonuna tıklayın

---

## 2. PC Parçalarını Ekleme

Admin panelinde **Products → PC Components** bölümüne gidin.

### Yeni Parça Ekleme

1. **Add PC Component** butonuna tıklayın
2. Alanları doldurun:

| Alan | Açıklama | Örnek |
|------|----------|-------|
| **Product** | Mevcut ürünlerden seçin (opsiyonel) | - |
| **Component Type** | Hangi tür parça | İşlemci (CPU) |
| **Brand** | Marka | Intel, AMD, NVIDIA |
| **Model Name** | Model adı | Core i7-13700K |
| **Price** | Fiyat (TL) | 12500.00 |
| **Stock** | Stok adedi | 50 |
| **Image** | Ürün görseli | Dosya yükleyin |
| **Specifications** | Teknik özellikler (JSON) | Aşağıya bakın |
| **Compatibility Rules** | Uyumluluk kuralları (JSON) | Aşağıya bakın |
| **Is Active** | Aktif mi? | ✅ İşaretleyin |

### Specifications (Teknik Özellikler) JSON Formatı

```json
{
    "Çekirdek": "16 (8P+8E)",
    "Frekans": "5.4 GHz",
    "Soket": "LGA 1700",
    "TDP": "125W",
    "Önbellek": "30MB"
}
```

### Compatibility Rules (Uyumluluk Kuralları) JSON Formatı

```json
{
    "socket": "LGA 1700",
    "ram_type": "DDR5",
    "max_tdp": 125
}
```

> 💡 **İpucu**: Şimdilik uyumluluk kurallarını boş bırakabilirsiniz. İleride otomatik uyumluluk filtrelemesi için kullanılacak.

---

## 3. Kullanıcı Build'lerini Yönetme

Admin panelinde **Products → PC Builds** bölümünden kullanıcıların oluşturduğu yapılandırmaları görebilirsiniz.

### Build Detayları

- **User**: Yapılandırmayı oluşturan kullanıcı
- **Session ID**: Misafir kullanıcılar için oturum kimliği
- **Name**: Yapılandırma adı
- **Total Price**: Toplam tutar
- **Is Complete**: Tamamlanmış mı?
- **Created At**: Oluşturulma tarihi

### PCBuildComponent

Her build'in içindeki parçaları **PC Build Components** bölümünden görebilirsiniz.

---

## Örnek Veri Seti

Hızlı başlangıç için örnek parçalar:

### İşlemciler (CPU)

| Marka | Model | Fiyat | Specifications |
|-------|-------|-------|----------------|
| Intel | Core i5-13400F | ₺6.500 | `{"Çekirdek": "10", "Frekans": "4.6 GHz", "Soket": "LGA 1700"}` |
| Intel | Core i7-13700K | ₺12.500 | `{"Çekirdek": "16", "Frekans": "5.4 GHz", "Soket": "LGA 1700"}` |
| Intel | Core i9-13900K | ₺18.000 | `{"Çekirdek": "24", "Frekans": "5.8 GHz", "Soket": "LGA 1700"}` |
| AMD | Ryzen 5 7600X | ₺7.000 | `{"Çekirdek": "6", "Frekans": "5.3 GHz", "Soket": "AM5"}` |
| AMD | Ryzen 7 7800X3D | ₺14.000 | `{"Çekirdek": "8", "Frekans": "5.0 GHz", "Soket": "AM5", "3D V-Cache": "96MB"}` |
| AMD | Ryzen 9 7950X | ₺20.000 | `{"Çekirdek": "16", "Frekans": "5.7 GHz", "Soket": "AM5"}` |

### Ekran Kartları (GPU)

| Marka | Model | Fiyat | Specifications |
|-------|-------|-------|----------------|
| NVIDIA | RTX 4060 | ₺12.000 | `{"VRAM": "8GB GDDR6", "Çekirdek": "3072 CUDA", "TDP": "115W"}` |
| NVIDIA | RTX 4070 | ₺20.000 | `{"VRAM": "12GB GDDR6X", "Çekirdek": "5888 CUDA", "TDP": "200W"}` |
| NVIDIA | RTX 4080 | ₺40.000 | `{"VRAM": "16GB GDDR6X", "Çekirdek": "9728 CUDA", "TDP": "320W"}` |
| NVIDIA | RTX 4090 | ₺65.000 | `{"VRAM": "24GB GDDR6X", "Çekirdek": "16384 CUDA", "TDP": "450W"}` |
| AMD | RX 7600 | ₺10.000 | `{"VRAM": "8GB GDDR6", "Çekirdek": "2048 SP", "TDP": "165W"}` |
| AMD | RX 7800 XT | ₺18.000 | `{"VRAM": "16GB GDDR6", "Çekirdek": "3840 SP", "TDP": "263W"}` |

### RAM

| Marka | Model | Fiyat | Specifications |
|-------|-------|-------|----------------|
| Kingston | Fury Beast 16GB | ₺1.800 | `{"Kapasite": "16GB (2x8GB)", "Hız": "3200MHz", "Tip": "DDR4"}` |
| Kingston | Fury Beast 32GB | ₺3.200 | `{"Kapasite": "32GB (2x16GB)", "Hız": "3600MHz", "Tip": "DDR4"}` |
| Corsair | Vengeance 32GB DDR5 | ₺4.500 | `{"Kapasite": "32GB (2x16GB)", "Hız": "5600MHz", "Tip": "DDR5"}` |
| G.Skill | Trident Z5 64GB | ₺8.000 | `{"Kapasite": "64GB (2x32GB)", "Hız": "6000MHz", "Tip": "DDR5"}` |

### Anakartlar

| Marka | Model | Fiyat | Specifications |
|-------|-------|-------|----------------|
| ASUS | Prime B660M-A | ₺4.000 | `{"Soket": "LGA 1700", "Form": "Micro-ATX", "RAM": "DDR4"}` |
| MSI | MAG B760 Tomahawk | ₺6.500 | `{"Soket": "LGA 1700", "Form": "ATX", "RAM": "DDR5"}` |
| Gigabyte | B650 Gaming X | ₺5.500 | `{"Soket": "AM5", "Form": "ATX", "RAM": "DDR5"}` |
| ASUS | ROG Strix X670E-E | ₺15.000 | `{"Soket": "AM5", "Form": "ATX", "RAM": "DDR5", "WiFi": "6E"}` |

### SSD / Depolama

| Marka | Model | Fiyat | Specifications |
|-------|-------|-------|----------------|
| Samsung | 980 500GB | ₺1.200 | `{"Kapasite": "500GB", "Tip": "NVMe M.2", "Okuma": "3500 MB/s"}` |
| Samsung | 980 Pro 1TB | ₺3.000 | `{"Kapasite": "1TB", "Tip": "NVMe M.2", "Okuma": "7000 MB/s"}` |
| WD | Black SN850X 2TB | ₺5.500 | `{"Kapasite": "2TB", "Tip": "NVMe M.2", "Okuma": "7300 MB/s"}` |

### Güç Kaynakları (PSU)

| Marka | Model | Fiyat | Specifications |
|-------|-------|-------|----------------|
| Corsair | CV550 | ₺1.500 | `{"Güç": "550W", "Sertifika": "80+ Bronze"}` |
| Corsair | RM750 | ₺3.000 | `{"Güç": "750W", "Sertifika": "80+ Gold", "Modüler": "Tam"}` |
| Seasonic | Focus GX-850 | ₺4.000 | `{"Güç": "850W", "Sertifika": "80+ Gold", "Modüler": "Tam"}` |
| Corsair | RM1000x | ₺5.500 | `{"Güç": "1000W", "Sertifika": "80+ Gold", "Modüler": "Tam"}` |

### Kasalar

| Marka | Model | Fiyat | Specifications |
|-------|-------|-------|----------------|
| NZXT | H510 | ₺2.500 | `{"Form": "Mid-Tower", "Cam Panel": "Temperli", "Fan": "2x 120mm"}` |
| Corsair | 4000D Airflow | ₺3.500 | `{"Form": "Mid-Tower", "Cam Panel": "Temperli", "Fan": "2x 120mm"}` |
| Lian Li | O11 Dynamic | ₺5.000 | `{"Form": "Mid-Tower", "Cam Panel": "3 Taraflı", "Fan": "Yok (Ayrı)"}` |

---

## 🚀 Hızlı Başlangıç Kontrol Listesi

- [ ] Admin paneline giriş yap: `https://cemcedimoglu.me/admin/`
- [ ] **Component Types** bölümünden parça türlerini ekle (en az 7 tür)
- [ ] **PC Components** bölümünden her türe en az 2-3 parça ekle
- [ ] Frontend'de `/pc-builder` sayfasını test et
- [ ] Parça seçimi ve sepete eklemeyi dene

---

## ❓ Sık Sorulan Sorular

### Parçalar görünmüyor?
- **Is Active** kutusunun işaretli olduğundan emin olun
- Component Type'ın doğru seçildiğini kontrol edin
- Backend'in çalıştığından emin olun

### Uyumluluk kuralları nasıl çalışır?
- Şu an uyumluluk filtrelemesi aktif değil
- İleride `compatibility_rules` JSON'una göre otomatik filtreleme eklenecek

### Mevcut ürünlerle bağlantı nasıl kurulur?
- **Product** alanından mevcut bir ürün seçebilirsiniz
- Bu sayede aynı ürün hem normal mağazada hem PC Builder'da görünür

---

## 📞 Destek

Sorularınız için: admin@cemcedimoglu.me
