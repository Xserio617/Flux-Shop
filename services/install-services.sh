#!/bin/bash

# E-Ticaret Servislerini Kur ve Etkinleştir
# Bu scripti sudo ile çalıştırın: sudo bash install-services.sh

echo "🚀 E-Ticaret servisleri kuruluyor..."

# Servis dosyalarını systemd klasörüne kopyala
sudo cp /home/xserio/e_ticaret_projesi/services/eticaret-backend.service /etc/systemd/system/
sudo cp /home/xserio/e_ticaret_projesi/services/eticaret-frontend.service /etc/systemd/system/
sudo cp /home/xserio/e_ticaret_projesi/services/eticaret-ngrok.service /etc/systemd/system/

# Systemd'yi yeniden yükle
sudo systemctl daemon-reload

# Servisleri etkinleştir (boot'ta başlasın)
sudo systemctl enable eticaret-backend.service
sudo systemctl enable eticaret-frontend.service
sudo systemctl enable eticaret-ngrok.service

# Servisleri başlat
sudo systemctl start eticaret-backend.service
sudo systemctl start eticaret-frontend.service
sudo systemctl start eticaret-ngrok.service

echo ""
echo "✅ Tüm servisler kuruldu ve başlatıldı!"
echo ""
echo "📋 Servis Durumlarını Kontrol Et:"
echo "   sudo systemctl status eticaret-backend"
echo "   sudo systemctl status eticaret-frontend"
echo "   sudo systemctl status eticaret-ngrok"
echo ""
echo "🔧 Servis Yönetimi:"
echo "   sudo systemctl stop eticaret-backend"
echo "   sudo systemctl restart eticaret-frontend"
echo "   sudo systemctl disable eticaret-ngrok"
echo ""
echo "📝 Logları Görüntüle:"
echo "   sudo journalctl -u eticaret-backend -f"
echo "   sudo journalctl -u eticaret-frontend -f"
echo "   sudo journalctl -u eticaret-ngrok -f"
echo ""
