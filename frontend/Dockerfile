# Frontend Dockerfile - Önceden build edilmiş dist klasörünü kullan
FROM alpine:latest

WORKDIR /app

# Yerel olarak build edilmiş dist klasörünü kopyala
# Önce: cd frontend && npm run build
COPY dist /app/dist

# Bu image sadece static dosyaları tutar
# Nginx container'ı bu dosyaları volume ile alacak
