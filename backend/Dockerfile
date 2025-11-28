# Backend Dockerfile - Django + Gunicorn
FROM python:3.12-slim-bookworm

# Çalışma ortamı değişkenleri
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Çalışma dizini
WORKDIR /app

# Sistem bağımlılıkları - minimal
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Python bağımlılıkları
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodunu kopyala
COPY . .

# Static dosyaları topla
RUN python manage.py collectstatic --noinput

# Port
EXPOSE 8000

# Gunicorn ile başlat
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "config.wsgi:application"]
