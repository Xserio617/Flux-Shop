from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, 
    CampaignList, 
    SiteSettingsView, 
    FavoriteListCreateView, 
    FavoriteDeleteView, 
    ReviewListCreateView, 
    ReviewImageCreateView,
    CategoryList,
    PromoBannerList,
    OrderListCreateView,
    OrderDetailView,
    GeminiChatView,
    BugReportCreateView,
    CouponValidateView,
    PaymentSettingsView,
    IyzicoPaymentView,
    InstallmentView,
    UserBehaviorCreateView,
    RecommendationView,
    AIProductGeneratorView,
    # PC Builder
    ComponentTypeListView,
    PCComponentListView,
    PCComponentDetailView,
    PCBuildListCreateView,
    PCBuildDetailView,
    AddComponentToBuildView,
    RemoveComponentFromBuildView,
    CompatibleComponentsView,
    AddBuildToCartView,
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    # Ürünler (Router üzerinden)
    path('', include(router.urls)), 
    
    # Kampanyalar ve Ayarlar
    path('campaigns/', CampaignList.as_view(), name='campaign-list'),
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    
    # Reklam Bannerları
    path('promo-banners/', PromoBannerList.as_view(), name='promo-banner-list'),
    
    # Favoriler
    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    path('favorites/<int:pk>/', FavoriteDeleteView.as_view(), name='favorite-delete'),
    
    # Yorumlar
    path('products/<int:product_id>/reviews/', ReviewListCreateView.as_view(), name='product-reviews'),
    path('reviews/<int:review_id>/images/', ReviewImageCreateView.as_view(), name='review-images'),
    
    # Kategoriler
    path('categories/', CategoryList.as_view(), name='category-list'),
    
    # Siparişler
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    
    # Gemini AI Chat
    path('chat/', GeminiChatView.as_view(), name='gemini-chat'),
    
    # Bug Report (Hata Bildirimi)
    path('bug-reports/', BugReportCreateView.as_view(), name='bug-report-create'),
    
    # Kuponlar
    path('coupons/validate/', CouponValidateView.as_view(), name='coupon-validate'),
    
    # Ödeme (Iyzico)
    path('payment/settings/', PaymentSettingsView.as_view(), name='payment-settings'),
    path('payment/process/', IyzicoPaymentView.as_view(), name='payment-process'),
    path('payment/installments/', InstallmentView.as_view(), name='payment-installments'),
    
    # Kullanıcı Davranış Takibi & Öneriler
    path('behavior/', UserBehaviorCreateView.as_view(), name='user-behavior'),
    path('recommendations/', RecommendationView.as_view(), name='recommendations'),
    
    # AI Ürün Oluşturucu (Admin)
    path('ai/generate-product/', AIProductGeneratorView.as_view(), name='ai-generate-product'),
    
    # ============== PC BUILDER ==============
    # Parça türleri (İşlemci, Anakart, RAM, vb.)
    path('pc-builder/component-types/', ComponentTypeListView.as_view(), name='component-types'),
    
    # PC Parçaları
    path('pc-builder/components/', PCComponentListView.as_view(), name='pc-components'),
    path('pc-builder/components/<int:pk>/', PCComponentDetailView.as_view(), name='pc-component-detail'),
    
    # PC Yapılandırmaları (Build)
    path('pc-builder/builds/', PCBuildListCreateView.as_view(), name='pc-builds'),
    path('pc-builder/builds/<int:pk>/', PCBuildDetailView.as_view(), name='pc-build-detail'),
    
    # Build'e parça ekleme/kaldırma
    path('pc-builder/builds/<int:build_id>/add-component/', AddComponentToBuildView.as_view(), name='add-component'),
    path('pc-builder/builds/<int:build_id>/remove-component/<int:component_id>/', RemoveComponentFromBuildView.as_view(), name='remove-component'),
    
    # Uyumlu parçalar
    path('pc-builder/builds/<int:build_id>/compatible/', CompatibleComponentsView.as_view(), name='compatible-components'),
    
    # Build'i sepete ekle
    path('pc-builder/builds/<int:build_id>/add-to-cart/', AddBuildToCartView.as_view(), name='build-to-cart'),
]