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
    AIProductGeneratorView
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
]