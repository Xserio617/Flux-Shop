from django.contrib import admin
from django.urls import path
from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json
from .models import Category, Product, Campaign, SiteConfiguration, Favorite, Review, PromoBanner, ReviewImage, ProductImage, Order, OrderItem, BugReport, Coupon, PaymentSettings, UserBehavior, ComponentType, PCComponent, PCBuild, PCBuildComponent

# 1. KATEGORİLER
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# 2. ÜRÜNLER
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'alt_text', 'order')
    ordering = ('order',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'created_at')
    list_filter = ('category',)
    search_fields = ('name',)
    inlines = [ProductImageInline]
    
    # AI butonu için özel template
    change_form_template = 'admin/products/product/change_form.html'
    add_form_template = 'admin/products/product/change_form.html'
    
    def changeform_view(self, request, object_id=None, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['categories'] = Category.objects.all()
        return super().changeform_view(request, object_id, form_url, extra_context)

# 3. KAMPANYA BANNERLARI (Hero Slider)
@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title',)

# 4. SİTE AYARLARI (Top Bar - Singleton)
@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    # !!! DİKKAT: main_announcement_text ALANI LİSTEDEN ÇIKARILDI !!!
    list_display = ('is_active',) # Sadece Aktiflik Sütununu Göster
    
    # Singleton Kuralı: Eğer zaten bir ayar varsa, ikincisini ekletme
    def has_add_permission(self, request):
        if SiteConfiguration.objects.exists():
            return False
        return True

    def has_delete_permission(self, request, obj=None):
        return False # Silmeyi engelle
        
# 5. FAVORİLER
@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')

# 6. YORUMLAR (Reviews)
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'rating', 'created_at')
    list_filter = ('rating',)


# 6.1 YORUM RESİMLERİ (Review Images)
@admin.register(ReviewImage)
class ReviewImageAdmin(admin.ModelAdmin):
    list_display = ('review', 'uploaded_at')
    list_filter = ('uploaded_at',)


# 6.2 ÜRÜN RESİMLERİ (Product Images)
@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'order', 'uploaded_at')
    list_filter = ('product', 'uploaded_at')
    ordering = ('product', 'order')


# 7. SİPARİŞLER
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ('product', 'quantity', 'price')
    readonly_fields = ('product', 'quantity', 'price')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'user__email', 'customer_name')
    inlines = [OrderItemInline]
    readonly_fields = ('order_number', 'created_at', 'updated_at')
    ordering = ('-created_at',)


# 7.1 SİPARİŞ ÜRÜN DETAYı
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    list_filter = ('order__created_at',)
    search_fields = ('product__name', 'order__order_number')


# 8. REKLAM BANNERLARI (Süper Fırsatlar Altı)
@admin.register(PromoBanner)
class PromoBannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title',)
    list_editable = ('is_active', 'order')  # Listeden direkt düzenlenebilir
    ordering = ('order', '-created_at')


# 9. BUG BİLDİRİMLERİ (Hata Raporları)
@admin.register(BugReport)
class BugReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'priority', 'status', 'created_at')
    list_filter = ('priority', 'status', 'created_at')
    search_fields = ('title', 'description', 'user__email')
    list_editable = ('priority', 'status')  # Listeden direkt düzenlenebilir
    ordering = ('-created_at',)
    readonly_fields = ('user', 'page_url', 'user_agent', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Bug Bilgileri', {
            'fields': ('title', 'description', 'priority', 'status')
        }),
        ('Kullanıcı Bilgileri', {
            'fields': ('user', 'page_url', 'user_agent'),
            'classes': ('collapse',)  # Varsayılan olarak kapalı
        }),
        ('Admin Notları', {
            'fields': ('admin_notes',)
        }),
        ('Tarihler', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

# 10. KUPONLAR
@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_percentage', 'active', 'valid_from', 'valid_to', 'usage_limit', 'used_count', 'min_purchase_amount')
    list_filter = ('active', 'valid_from', 'valid_to')
    search_fields = ('code',)


# 11. ÖDEME AYARLARI (Iyzico - Singleton)
@admin.register(PaymentSettings)
class PaymentSettingsAdmin(admin.ModelAdmin):
    list_display = ('get_mode_display', 'demo_mode', 'is_live_mode', 'updated_at')
    
    fieldsets = (
        ('Mod Seçimi', {
            'fields': ('demo_mode', 'is_live_mode'),
            'description': '⚠️ Demo Modu açıkken gerçek ödeme alınmaz, simülasyon yapılır.'
        }),
        ('Sandbox (Test) API Bilgileri', {
            'fields': ('sandbox_api_key', 'sandbox_secret_key'),
            'classes': ('collapse',),
            'description': 'Iyzico Sandbox hesabından alınır. Test ödemeleri için kullanılır.'
        }),
        ('Canlı (Production) API Bilgileri', {
            'fields': ('live_api_key', 'live_secret_key'),
            'classes': ('collapse',),
            'description': '⚠️ DİKKAT: Canlı modda gerçek para işlenir!'
        }),
    )
    
    def get_mode_display(self, obj):
        if obj.demo_mode:
            return "🎭 Demo Modu"
        elif obj.is_live_mode:
            return "🟢 Canlı Mod"
        else:
            return "🟡 Test Modu"
    get_mode_display.short_description = "Aktif Mod"
    
    # Singleton - sadece tek kayıt
    def has_add_permission(self, request):
        if PaymentSettings.objects.exists():
            return False
        return True
    
    def has_delete_permission(self, request, obj=None):
        return False


# 12. KULLANICI DAVRANIŞLARI (Zaman Takibi)
@admin.register(UserBehavior)
class UserBehaviorAdmin(admin.ModelAdmin):
    list_display = ('get_user_display', 'product', 'total_duration_seconds', 'view_count', 'last_viewed_at')
    list_filter = ('last_viewed_at', 'product__category')
    search_fields = ('user__email', 'product__name')
    ordering = ('-last_viewed_at',)
    readonly_fields = ('user', 'product', 'total_duration_seconds', 'view_count', 'last_viewed_at', 'first_viewed_at')
    
    def get_user_display(self, obj):
        if obj.user:
            return obj.user.email
        return "Bilinmeyen"
    get_user_display.short_description = "Kullanıcı"
    
    def has_add_permission(self, request):
        return False  # Manuel ekleme yok, otomatik kaydediliyor


# ============================================================
# 13. PC BUILDER (BİLGİSAYAR TOPLAMA) ADMIN
# ============================================================

@admin.register(ComponentType)
class ComponentTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'order', 'is_required')
    list_editable = ('order', 'is_required')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('order',)


@admin.register(PCComponent)
class PCComponentAdmin(admin.ModelAdmin):
    list_display = ('get_display_name', 'component_type', 'brand', 'get_price', 'is_active')
    list_filter = ('component_type', 'brand', 'is_active')
    search_fields = ('product__name', 'brand', 'model_name')
    list_editable = ('is_active',)
    ordering = ('component_type__order', 'brand', 'model_name')
    autocomplete_fields = ['product']
    
    fieldsets = (
        ('Ürün Bağlantısı', {
            'fields': ('product', 'component_type'),
            'description': 'Bu PC parçasının bağlı olduğu ürün ve türü'
        }),
        ('Parça Bilgileri', {
            'fields': ('brand', 'model_name')
        }),
        ('Teknik Özellikler (JSON)', {
            'fields': ('specifications',),
            'description': '''
            Örnek formatlar:
            - İşlemci: {"socket": "AM5", "cores": 8, "threads": 16, "base_clock": "3.4GHz", "tdp": 65}
            - Anakart: {"socket": "AM5", "ram_type": "DDR5", "form_factor": "ATX", "ram_slots": 4}
            - RAM: {"type": "DDR5", "speed": 6000, "capacity": "32GB", "kit": "2x16GB"}
            - Ekran Kartı: {"vram": "12GB", "length_mm": 320, "power_connector": "8pin", "tdp": 250}
            - PSU: {"wattage": 750, "efficiency": "80+ Gold", "modular": true}
            - Kasa: {"form_factor": "ATX", "max_gpu_length": 380, "max_cpu_cooler": 165}
            - SSD: {"capacity": "1TB", "type": "NVMe", "interface": "PCIe 4.0"}
            '''
        }),
        ('Uyumluluk Kuralları (JSON)', {
            'fields': ('compatibility_rules',),
            'classes': ('collapse',),
            'description': '''
            Hangi spec'ler eşleşmeli? Örnek:
            - RAM için: {"type": "motherboard.ram_type"}
            - İşlemci için: {"socket": "motherboard.socket"}
            '''
        }),
        ('Durum', {
            'fields': ('is_active',)
        }),
    )
    
    def get_display_name(self, obj):
        return f"{obj.brand} {obj.model_name}"
    get_display_name.short_description = "Parça Adı"
    
    def get_price(self, obj):
        return f"{obj.product.price} TL"
    get_price.short_description = "Fiyat"


class PCBuildComponentInline(admin.TabularInline):
    model = PCBuildComponent
    extra = 0
    readonly_fields = ('component', 'added_at')
    can_delete = True
    
    def has_add_permission(self, request, obj=None):
        return False  # Inline'dan ekleme yok, API ile eklenir


@admin.register(PCBuild)
class PCBuildAdmin(admin.ModelAdmin):
    list_display = ('get_build_name', 'user', 'total_price', 'is_complete', 'created_at')
    list_filter = ('is_complete', 'created_at')
    search_fields = ('name', 'user__email')
    readonly_fields = ('total_price', 'is_complete', 'created_at', 'updated_at')
    inlines = [PCBuildComponentInline]
    ordering = ('-updated_at',)
    
    def get_build_name(self, obj):
        return obj.name or f"Build #{obj.id}"
    get_build_name.short_description = "Yapılandırma"
