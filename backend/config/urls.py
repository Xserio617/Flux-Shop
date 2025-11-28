"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve
import os

# JWT Token Gerekli Kütüphaneler
from rest_framework_simplejwt.views import (
    TokenObtainPairView, # Giriş yapıp token alacağımız adres
    TokenRefreshView,    # Token'ı yenileyeceğimiz adres
)

# Frontend dist klasörü
FRONTEND_DIR = os.path.join(settings.BASE_DIR.parent, 'frontend', 'dist')

urlpatterns = [
    # 1. TEMEL YOLLAR
    path('admin/', admin.site.urls),
    
    # 2. ÜRÜN API'Sİ
    path('api/', include('products.urls')),
    
    # 3. KULLANICI GİRİŞ/TOKEN API YOLLARI (JWT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('users.urls')),
]

# 4. FOTOĞRAF (MEDIA) VE STATİK DOSYA YOLLARI (SADECE GELİŞTİRME MODUNDA)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Frontend assets (JS, CSS, images)
    urlpatterns += [
        re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': os.path.join(FRONTEND_DIR, 'assets')}),
    ]
    
    # Frontend - tüm diğer yollar index.html'e yönlendir (SPA için)
    urlpatterns += [
        re_path(r'^(?!api|admin|media|assets).*$', serve, {'document_root': FRONTEND_DIR, 'path': 'index.html'}),
    ]