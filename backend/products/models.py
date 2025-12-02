from django.db import models
from django.conf import settings
from django.conf import settings # User modeli için gerekli
from django.utils import timezone

# 1. KATEGORİ MODELİ (En tepede olmalı)
class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Kategori Adı")
    slug = models.SlugField(unique=True, null=True, blank=True)
    
    # !!! BURASI KRİTİK: Kendi Kendine Bağlantı (Self-Referencing ForeignKey) !!!
    # Parent (Üst) kategoriyi tanımlar. Ana kategorilerde bu alan NULL kalır.
    parent = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, # Parent silinirse alt kategoriler "parent=NULL" olur
        null=True, 
        blank=True, 
        related_name='children', # Parent'tan alt kategorilere erişim için
        verbose_name="Üst Kategori"
    )

    class Meta:
        verbose_name = "Kategori"
        verbose_name_plural = "Kategoriler"
        # Ağaç yapısındaki veriler için bu sıralama önemlidir
        ordering = ['parent__name', 'name'] 

    def __str__(self):
        # Kategori ismini hiyerarşik gösterir (Örn: Elektronik > Telefon)
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name

# 2. ÜRÜN MODELİ (Bu olmazsa Favorite ve Review hata verir!)
class Product(models.Model):
    # Kategori bağlantısı
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products', verbose_name="Kategori")
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='product_images/')
    created_at = models.DateTimeField(auto_now_add=True)

    # İndirim ve Etiket Alanları
    is_new = models.BooleanField(default=False, verbose_name="Yeni Ürün Etiketi")
    discount_rate = models.IntegerField(default=0, verbose_name="İndirim Oranı (%)")
    discount_start_date = models.DateTimeField(null=True, blank=True, verbose_name="İndirim Başlangıcı")
    discount_end_date = models.DateTimeField(null=True, blank=True, verbose_name="İndirim Bitişi")

    def __str__(self):
        return self.name


# 3. KAMPANYA MODELİ (Hero Slider)
class Campaign(models.Model):
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='campaign_banners/')
    link_url = models.URLField(max_length=500, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Kampanya Banner'ı"
        verbose_name_plural = "Kampanya Banner'ları"
        ordering = ['-created_at']


# 4. SİTE AYARLARI MODELİ (TopBar - Singleton)

class SiteConfiguration(models.Model):
    # main_announcement_text alanı KALDIRILDI
    
    # GÖRSEL ALANLARI KALDI
    topbar_image = models.ImageField(
        upload_to='topbar_banners/', 
        null=True, 
        blank=True, 
        verbose_name="Duyuru Görseli (1058x64px ideal)"
    )
    topbar_link = models.URLField(
        max_length=500, 
        null=True, 
        blank=True, 
        verbose_name="Tıklanınca Gidilecek Link"
    )
    is_active = models.BooleanField(default=True, verbose_name="Duyuruyu Göster")
    
    def __str__(self):
        return "Site Genel Ayarları (Tekil)"

    class Meta:
        verbose_name = "Site Genel Ayarı"
        verbose_name_plural = "Site Genel Ayarları"


# 5. FAVORİ MODELİ (Product'a bağlı)
class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product') 
        verbose_name = 'Favori'
        verbose_name_plural = 'Favoriler'

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"


# 6. YORUM (REVIEW) MODELİ (Product'a bağlı)
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField(default=5, choices=[(i, i) for i in range(1, 6)]) # 1-5 Yıldız
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.rating})"


# 6.1 YORUM RESİMLERİ MODELİ (Review'a bağlı - Çoklu Resim)
class ReviewImage(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='review_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Yorum Resmi"
        verbose_name_plural = "Yorum Resimleri"

    def __str__(self):
        return f"Resim - {self.review.id}"


# 6.2 ÜRÜN RESİMLERİ MODELİ (Product'a bağlı - Çoklu Resim)
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/')
    alt_text = models.CharField(max_length=200, blank=True, null=True, verbose_name="Alt Yazı")
    order = models.IntegerField(default=0, verbose_name="Sıralama")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Ürün Resmi"
        verbose_name_plural = "Ürün Resimleri"
        ordering = ['order']

    def __str__(self):
        return f"{self.product.name} - Resim {self.order}"


# 7. SİPARİŞ MODELİ
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Beklemede'),
        ('processing', 'İşleniyor'),
        ('shipped', 'Gönderildi'),
        ('delivered', 'Teslim Edildi'),
        ('cancelled', 'İptal Edildi'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    order_number = models.CharField(max_length=20, unique=True, verbose_name="Sipariş Numarası")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Toplam Fiyat")
    coupon = models.ForeignKey('Coupon', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Kullanılan Kupon")

    
    # Teslimat Bilgileri
    customer_name = models.CharField(max_length=255, verbose_name="Müşteri Adı")
    delivery_address = models.TextField(verbose_name="Teslimat Adresi")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Sipariş Durumu")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Sipariş Tarihi")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Son Güncelleme")
    
    class Meta:
        verbose_name = "Sipariş"
        verbose_name_plural = "Siparişler"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.order_number} - {self.user.email}"


# 7.1 SİPARİŞ ÜRÜN DETAYı (Order'a bağlı)
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, related_name='order_items')
    quantity = models.IntegerField(default=1, verbose_name="Miktar")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Birim Fiyatı")
    
    class Meta:
        verbose_name = "Sipariş Ürünü"
        verbose_name_plural = "Sipariş Ürünleri"
    
    def __str__(self):
        return f"{self.product.name} - {self.quantity}x"


# 8. REKLAM BANNER MODELİ (Süper Fırsatlar Altı)
class PromoBanner(models.Model):
    title = models.CharField(max_length=200, verbose_name="Banner Başlığı (Admin için)")
    image = models.ImageField(upload_to='promo_banners/', verbose_name="Banner Görseli")
    link_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="Tıklanınca Gidilecek Link")
    is_active = models.BooleanField(default=True, verbose_name="Aktif mi?")
    order = models.IntegerField(default=0, verbose_name="Sıralama (Küçük önce)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Reklam Bannerı"
        verbose_name_plural = "Reklam Bannerları"
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


# 9. BUG REPORT MODELİ (Kullanıcı Hata Bildirimleri)
class BugReport(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Düşük'),
        ('medium', 'Orta'),
        ('high', 'Yüksek'),
        ('critical', 'Kritik'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Açık'),
        ('in_progress', 'İnceleniyor'),
        ('resolved', 'Çözüldü'),
        ('closed', 'Kapatıldı'),
    ]
    
    # Anonim kullanıcılar da bug bildirebilir
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='bug_reports',
        verbose_name="Bildiren Kullanıcı"
    )
    
    title = models.CharField(max_length=200, verbose_name="Bug Başlığı")
    description = models.TextField(verbose_name="Açıklama")
    
    # Otomatik toplanan bilgiler
    page_url = models.CharField(max_length=500, blank=True, null=True, verbose_name="Sayfa URL'i")
    user_agent = models.CharField(max_length=500, blank=True, null=True, verbose_name="Tarayıcı Bilgisi")
    
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium', verbose_name="Öncelik")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open', verbose_name="Durum")
    
    admin_notes = models.TextField(blank=True, null=True, verbose_name="Admin Notları")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Bildirim Tarihi")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Son Güncelleme")
    
    class Meta:
        verbose_name = "Bug Bildirimi"
        verbose_name_plural = "Bug Bildirimleri"
        ordering = ['-created_at']
    
    def __str__(self):
        user_info = self.user.email if self.user else "Anonim"
        return f"[{self.get_priority_display()}] {self.title} - {user_info}"

# 10. KUPON MODELİ (İndirim Kuponları)
class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True, verbose_name="Kupon Kodu")
    discount_percentage = models.IntegerField(verbose_name="İndirim Oranı (%)")
    valid_from = models.DateTimeField(verbose_name="Başlangıç Tarihi")
    valid_to = models.DateTimeField(verbose_name="Bitiş Tarihi")
    active = models.BooleanField(default=True, verbose_name="Aktif mi?")
    usage_limit = models.IntegerField(default=100, verbose_name="Kullanım Limiti")
    used_count = models.IntegerField(default=0, verbose_name="Kullanım Sayısı")
    
    # Yeni Eklenen Alanlar (Limitörler)
    min_purchase_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Minimum Sepet Tutarı")
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Maksimum İndirim Tutarı")
    
    class Meta:
        verbose_name = "İndirim Kuponu"

        verbose_name_plural = "İndirim Kuponları"
    
    def __str__(self):
        return f"{self.code} - %{self.discount_percentage}"
    
    def is_valid(self):
        now = timezone.now()
        return self.active and self.valid_from <= now <= self.valid_to and self.used_count < self.usage_limit


# 11. ÖDEME AYARLARI MODELİ (Iyzico - Singleton)
class PaymentSettings(models.Model):
    """Admin panelinden yönetilebilir ödeme ayarları"""
    
    # Mod Seçimi
    is_live_mode = models.BooleanField(
        default=False, 
        verbose_name="Canlı Mod",
        help_text="Kapalı = Test Modu (Sahte ödemeler), Açık = Gerçek Ödemeler"
    )
    
    # Sandbox (Test) API Bilgileri
    sandbox_api_key = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        verbose_name="Sandbox API Key",
        help_text="Iyzico Sandbox API anahtarı (Test için)"
    )
    sandbox_secret_key = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        verbose_name="Sandbox Secret Key",
        help_text="Iyzico Sandbox gizli anahtarı (Test için)"
    )
    
    # Production (Canlı) API Bilgileri
    live_api_key = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        verbose_name="Canlı API Key",
        help_text="Iyzico Production API anahtarı"
    )
    live_secret_key = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        verbose_name="Canlı Secret Key",
        help_text="Iyzico Production gizli anahtarı"
    )
    
    # Demo Modu (API olmadan simülasyon)
    demo_mode = models.BooleanField(
        default=True,
        verbose_name="Demo Modu",
        help_text="Açık = Gerçek API kullanılmaz, ödeme simüle edilir"
    )
    
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Son Güncelleme")
    
    class Meta:
        verbose_name = "Ödeme Ayarları"
        verbose_name_plural = "Ödeme Ayarları"
    
    @classmethod
    def get_settings(cls):
        """Singleton pattern - Tek bir ayar nesnesi döndürür veya oluşturur"""
        settings = cls.objects.first()
        if not settings:
            settings = cls.objects.create(demo_mode=True)
        return settings
    
    def __str__(self):
        if self.demo_mode:
            return "Ödeme Ayarları (Demo Modu)"
        elif self.is_live_mode:
            return "Ödeme Ayarları (Canlı Mod)"
        else:
            return "Ödeme Ayarları (Sandbox/Test Modu)"
    
    def get_api_credentials(self):
        """Mevcut moda göre API bilgilerini döndür"""
        if self.demo_mode:
            return None  # Demo modda API kullanılmaz
        
        if self.is_live_mode:
            return {
                'api_key': self.live_api_key,
                'secret_key': self.live_secret_key,
                'base_url': 'api.iyzipay.com'  # https:// olmadan
            }
        else:
            return {
                'api_key': self.sandbox_api_key,
                'secret_key': self.sandbox_secret_key,
                'base_url': 'sandbox-api.iyzipay.com'  # https:// olmadan
            }


# 12. KULLANICI DAVRANIŞ TAKİBİ MODELİ (AI Önerileri için)
class UserBehavior(models.Model):
    """Kullanıcının hangi ürüne ne kadar süre baktığını takip eder"""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='behaviors',
        verbose_name="Kullanıcı"
    )
    session_id = models.CharField(max_length=128, null=True, blank=True, verbose_name="Oturum ID")
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='views',
        verbose_name="Ürün"
    )
    
    # Görüntüleme metrikleri
    view_count = models.IntegerField(default=1, verbose_name="Görüntüleme Sayısı")
    total_duration_seconds = models.IntegerField(default=0, verbose_name="Toplam Süre (saniye)")
    last_viewed_at = models.DateTimeField(auto_now=True, verbose_name="Son Görüntüleme")
    first_viewed_at = models.DateTimeField(auto_now_add=True, verbose_name="İlk Görüntüleme")
    
    # Ek metrikler
    added_to_cart = models.BooleanField(default=False, verbose_name="Sepete Eklendi mi?")
    added_to_favorites = models.BooleanField(default=False, verbose_name="Favorilere Eklendi mi?")
    
    class Meta:
        verbose_name = "Kullanıcı Davranışı"
        verbose_name_plural = "Kullanıcı Davranışları"
        unique_together = ['user', 'product']  # Her kullanıcı-ürün çifti benzersiz
        ordering = ['-total_duration_seconds', '-view_count']
    
    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.total_duration_seconds}s)"
    
    @classmethod
    def record_view(cls, user, product_id, duration_seconds=0):
        """Ürün görüntülemesini kaydet veya güncelle"""
        behavior, created = cls.objects.get_or_create(
            user=user,
            product_id=product_id,
            defaults={'total_duration_seconds': duration_seconds}
        )
        
        if not created:
            behavior.view_count += 1
            behavior.total_duration_seconds += duration_seconds
            behavior.save()
        
        return behavior
    
    @classmethod
    def get_user_interests(cls, user, limit=10):
        """Kullanıcının en çok ilgilendiği ürünleri getir"""
        return cls.objects.filter(user=user).select_related('product', 'product__category')[:limit]


# ============================================================
# 13. PC BUILDER (BİLGİSAYAR TOPLAMA) MODELLERİ
# ============================================================

class ComponentType(models.Model):
    """PC Parça Türleri (İşlemci, Anakart, RAM, vb.)"""
    
    name = models.CharField(max_length=100, verbose_name="Parça Türü Adı")
    slug = models.SlugField(unique=True, verbose_name="URL Slug")
    icon = models.CharField(max_length=50, blank=True, null=True, verbose_name="İkon (CSS class)")
    order = models.IntegerField(default=0, verbose_name="Sıralama")
    is_required = models.BooleanField(default=True, verbose_name="Zorunlu mu?")
    
    class Meta:
        verbose_name = "Parça Türü"
        verbose_name_plural = "Parça Türleri"
        ordering = ['order']
    
    def __str__(self):
        return self.name


class PCComponent(models.Model):
    """PC Parçaları - Ürün modeline bağlı"""
    
    product = models.OneToOneField(
        Product, 
        on_delete=models.CASCADE, 
        related_name='pc_component',
        verbose_name="Bağlı Ürün"
    )
    component_type = models.ForeignKey(
        ComponentType, 
        on_delete=models.CASCADE, 
        related_name='components',
        verbose_name="Parça Türü"
    )
    
    # Marka ve Model
    brand = models.CharField(max_length=100, verbose_name="Marka")
    model_name = models.CharField(max_length=200, verbose_name="Model")
    
    # Uyumluluk için JSON alanı (esnek spec tanımı)
    # Örnek: {"socket": "AM5", "ram_type": "DDR5", "form_factor": "ATX", "wattage": 750}
    specifications = models.JSONField(default=dict, verbose_name="Teknik Özellikler")
    
    # Uyumluluk kuralları (hangi spec'ler diğer parçalarla eşleşmeli)
    # Örnek: {"socket": "motherboard.socket", "ram_type": "motherboard.ram_type"}
    compatibility_rules = models.JSONField(default=dict, blank=True, verbose_name="Uyumluluk Kuralları")
    
    is_active = models.BooleanField(default=True, verbose_name="Aktif mi?")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "PC Parçası"
        verbose_name_plural = "PC Parçaları"
        ordering = ['component_type__order', 'brand', 'model_name']
    
    def __str__(self):
        return f"{self.brand} {self.model_name} ({self.component_type.name})"


class PCBuild(models.Model):
    """Kullanıcının kaydettiği PC yapılandırmaları"""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='pc_builds',
        verbose_name="Kullanıcı"
    )
    session_id = models.CharField(max_length=128, null=True, blank=True, verbose_name="Oturum ID")
    
    name = models.CharField(max_length=200, blank=True, null=True, verbose_name="Yapılandırma Adı")
    
    # Seçilen parçalar
    components = models.ManyToManyField(
        PCComponent,
        through='PCBuildComponent',
        related_name='builds',
        verbose_name="Parçalar"
    )
    
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Toplam Fiyat")
    is_complete = models.BooleanField(default=False, verbose_name="Tamamlandı mı?")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "PC Yapılandırması"
        verbose_name_plural = "PC Yapılandırmaları"
        ordering = ['-updated_at']
    
    def __str__(self):
        name = self.name or f"Build #{self.id}"
        return f"{name} - {self.total_price} TL"
    
    def calculate_total(self):
        """Toplam fiyatı hesapla"""
        total = sum(
            bc.component.product.price 
            for bc in self.build_components.select_related('component__product')
        )
        self.total_price = total
        self.save()
        return total
    
    def check_completeness(self):
        """Zorunlu tüm parçalar seçildi mi?"""
        required_types = ComponentType.objects.filter(is_required=True).values_list('id', flat=True)
        selected_types = self.build_components.values_list('component__component_type_id', flat=True)
        self.is_complete = all(rt in selected_types for rt in required_types)
        self.save()
        return self.is_complete


class PCBuildComponent(models.Model):
    """PC Yapılandırması - Parça ilişki tablosu"""
    
    build = models.ForeignKey(
        PCBuild, 
        on_delete=models.CASCADE, 
        related_name='build_components'
    )
    component = models.ForeignKey(
        PCComponent, 
        on_delete=models.CASCADE,
        related_name='build_selections'
    )
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Yapılandırma Parçası"
        verbose_name_plural = "Yapılandırma Parçaları"
        unique_together = ['build', 'component']
    
    def __str__(self):
        return f"{self.build} - {self.component}"
