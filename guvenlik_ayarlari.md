# 🔒 Sunucu ve Site Güvenlik Yapılandırması

**Tarih:** 2 Aralık 2025  
**Domain:** cemcedimoglu.me

---

## 1. UFW Firewall (Güvenlik Duvarı)

### Açık Portlar:
| Port | Protokol | Açıklama |
|------|----------|----------|
| 22   | TCP      | SSH      |
| 80   | TCP      | HTTP     |
| 443  | TCP      | HTTPS    |

### Komutlar:
```bash
# Firewall durumunu gör
sudo ufw status

# Yeni port aç
sudo ufw allow 8080/tcp

# Port kapat
sudo ufw delete allow 8080/tcp

# Firewall'u kapat (YAPMA!)
sudo ufw disable
```

---

## 2. Nginx Güvenlik Headers

**Dosya:** `/etc/nginx/sites-enabled/eticaret.conf`

### Eklenen Header'lar:

| Header | Değer | Açıklama |
|--------|-------|----------|
| X-Frame-Options | SAMEORIGIN | Clickjacking saldırılarını engeller |
| X-XSS-Protection | 1; mode=block | Tarayıcı XSS filtresini aktifleştirir |
| X-Content-Type-Options | nosniff | MIME type sniffing'i engeller |
| Strict-Transport-Security | max-age=31536000 | HSTS - 1 yıl boyunca sadece HTTPS |
| Content-Security-Policy | ... | Hangi kaynaklardan içerik yüklenebilir |
| Permissions-Policy | geolocation=(), microphone=(), camera=() | Kamera/mikrofon erişimini engeller |
| Referrer-Policy | strict-origin-when-cross-origin | Referrer bilgisi kontrolü |

### Ek Ayarlar:
- `server_tokens off` - Nginx versiyonunu gizler
- `client_max_body_size 10M` - Max dosya upload boyutu

### Test Komutu:
```bash
# Header'ları kontrol et
curl -I https://cemcedimoglu.me
```

---

## 3. Django Güvenlik Ayarları

**Dosya:** `/home/xserio/e_ticaret_projesi/backend/config/settings.py`

### Yapılan Değişiklikler:

```python
# DEBUG kapatıldı (production)
DEBUG = False

# ALLOWED_HOSTS kısıtlandı
ALLOWED_HOSTS = ['cemcedimoglu.me', 'www.cemcedimoglu.me', 'localhost', '127.0.0.1']

# HTTPS Ayarları (DEBUG=False olduğunda aktif)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_SECURE = True      # Cookie sadece HTTPS üzerinden
CSRF_COOKIE_SECURE = True         # CSRF token sadece HTTPS üzerinden
SECURE_BROWSER_XSS_FILTER = True  # XSS filtresi
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000    # 1 yıl HSTS
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# CSRF güvenilir kaynaklar
CSRF_TRUSTED_ORIGINS = [
    'https://cemcedimoglu.me',
    'https://www.cemcedimoglu.me',
]

# CORS - Sadece kendi domainimizden gelen isteklere izin ver
CORS_ALLOWED_ORIGINS = [
    'https://cemcedimoglu.me',
    'https://www.cemcedimoglu.me',
]
```

---

## 4. Rate Limiting (İstek Sınırlama)

**Dosya:** `/home/xserio/e_ticaret_projesi/backend/config/settings.py`

### Django REST Framework Throttling:

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/minute',    # Anonim: 100 istek/dakika
        'user': '300/minute',    # Giriş yapmış: 300 istek/dakika
        'login': '5/minute',     # Login denemesi: 5/dakika
    }
}
```

### Login/Register için Özel Rate Limit:

**Dosya:** `/home/xserio/e_ticaret_projesi/backend/users/views.py`

```python
class LoginRateThrottle(AnonRateThrottle):
    rate = '5/minute'

class GoogleLoginView(APIView):
    throttle_classes = [LoginRateThrottle]
    # ...

class UserRegisterView(generics.CreateAPIView):
    throttle_classes = [LoginRateThrottle]
    # ...
```

---

## 5. Fail2ban (Otomatik IP Engelleme)

**Dosya:** `/etc/fail2ban/jail.local`

### Aktif Jail'ler:

| Jail | Açıklama | Max Deneme | Ban Süresi |
|------|----------|------------|------------|
| sshd | SSH brute force | 3 | 1 saat |
| nginx-http-auth | HTTP auth | 5 | 10 dakika |
| nginx-limit-req | Rate limit | 10 | 10 dakika |
| nginx-botsearch | Bot/scanner | 2 | 10 dakika |

### Komutlar:
```bash
# Fail2ban durumu
sudo fail2ban-client status

# Belirli jail durumu
sudo fail2ban-client status sshd

# IP'yi ban'dan çıkar
sudo fail2ban-client set sshd unbanip 192.168.1.100

# Yasaklı IP'leri gör
sudo fail2ban-client get sshd banned
```

---

## 6. SSH Güvenliği

**Dosya:** `/etc/ssh/sshd_config.d/custom-security.conf`

### Yapılan Ayarlar:

| Ayar | Değer | Açıklama |
|------|-------|----------|
| PermitRootLogin | no | Root ile SSH girişi kapalı |
| PasswordAuthentication | yes | Parola ile giriş açık (SSH key ekleyince kapat) |
| PubkeyAuthentication | yes | SSH key ile giriş açık |
| PermitEmptyPasswords | no | Boş parola engelli |
| X11Forwarding | no | X11 forwarding kapalı |
| MaxAuthTries | 3 | Max deneme sayısı |
| ClientAliveInterval | 300 | 5 dakika timeout |
| ClientAliveCountMax | 2 | 2 kontrol sonra bağlantı düşer |

### SSH Key Ekleme (Opsiyonel - Daha Güvenli):

Kendi bilgisayarında:
```bash
# SSH key oluştur
ssh-keygen -t ed25519 -C "senin@email.com"

# Public key'i sunucuya kopyala
ssh-copy-id xserio@cemcedimoglu.me
```

Sunucuda (key ekledikten sonra):
```bash
# Parola ile girişi kapat
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config.d/custom-security.conf
sudo systemctl restart ssh
```

---

## 7. Cloudflare Ayarları

### SSL/TLS Modu:
- **Ayar:** Full (strict)
- **Neden:** Nginx'te gerçek SSL sertifikası var, Cloudflare end-to-end şifreleme yapıyor

### Önerilen Ek Ayarlar (Cloudflare Dashboard):
1. **Security → WAF** - Web Application Firewall aktifleştir
2. **Security → Bots** - Bot koruması aç
3. **Speed → Minify** - JS/CSS/HTML minify
4. **Caching → Browser Cache TTL** - 1 ay yap

---

## 8. Kontrol Komutları

```bash
# ===== GENEL DURUM =====

# Firewall durumu
sudo ufw status

# Fail2ban durumu
sudo fail2ban-client status

# Nginx durumu
sudo systemctl status nginx

# Django backend durumu
sudo systemctl status eticaret-backend

# ===== LOG'LARI İZLE =====

# Nginx erişim logları
sudo tail -f /var/log/nginx/access.log

# Nginx hata logları
sudo tail -f /var/log/nginx/error.log

# Fail2ban logları
sudo tail -f /var/log/fail2ban.log

# SSH logları
sudo tail -f /var/log/auth.log

# ===== GÜVENLİK TESTİ =====

# SSL test (harici)
# https://www.ssllabs.com/ssltest/analyze.html?d=cemcedimoglu.me

# Security headers test (harici)
# https://securityheaders.com/?q=cemcedimoglu.me

# Header'ları kontrol et
curl -I https://cemcedimoglu.me
```

---

## 9. Servis Yeniden Başlatma

```bash
# Nginx yeniden başlat
sudo systemctl restart nginx

# Django backend yeniden başlat
sudo systemctl restart eticaret-backend

# Fail2ban yeniden başlat
sudo systemctl restart fail2ban

# SSH yeniden başlat
sudo systemctl restart ssh
```

---

## 10. Acil Durum

### Sunucuya erişemiyorsan:
1. Hosting panelinden console/VNC kullan
2. Recovery mode ile boot et
3. Fail2ban'ı geçici kapat: `sudo systemctl stop fail2ban`

### IP'n yanlışlıkla ban yediyse:
```bash
# SSH jail'den IP'yi çıkar
sudo fail2ban-client set sshd unbanip SENIN_IP_ADRESIN

# Tüm ban'ları temizle
sudo fail2ban-client unban --all
```

---

## ✅ Güvenlik Özeti

| Özellik | Durum |
|---------|-------|
| HTTPS | ✅ Aktif (Let's Encrypt) |
| Firewall | ✅ Aktif (UFW) |
| Güvenlik Headers | ✅ Aktif |
| Rate Limiting | ✅ Aktif |
| Brute Force Koruması | ✅ Aktif (Fail2ban) |
| SSH Güvenliği | ✅ Yapılandırıldı |
| CORS | ✅ Kısıtlandı |
| CSRF | ✅ Güvenli |
| Debug Mode | ✅ Kapalı |

---

*Son güncelleme: 2 Aralık 2025*
