#!/bin/bash

# E-Ticaret Servislerini Kaldır
# Bu scripti sudo ile çalıştırın: sudo bash uninstall-services.sh

echo "🛑 E-Ticaret servisleri kaldırılıyor..."

# Servisleri durdur
sudo systemctl stop eticaret-backend.service 2>/dev/null
sudo systemctl stop eticaret-frontend.service 2>/dev/null
sudo systemctl stop eticaret-ngrok.service 2>/dev/null

# Servisleri devre dışı bırak
sudo systemctl disable eticaret-backend.service 2>/dev/null
sudo systemctl disable eticaret-frontend.service 2>/dev/null
sudo systemctl disable eticaret-ngrok.service 2>/dev/null

# Servis dosyalarını sil
sudo rm -f /etc/systemd/system/eticaret-backend.service
sudo rm -f /etc/systemd/system/eticaret-frontend.service
sudo rm -f /etc/systemd/system/eticaret-ngrok.service

# Systemd'yi yeniden yükle
sudo systemctl daemon-reload

echo "✅ Tüm servisler kaldırıldı!"
