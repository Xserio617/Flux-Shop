#!/bin/bash
# Auto-deploy script for Flux-Shop

cd /home/xserio/e_ticaret_projesi

# Git pull
git pull origin main

# Frontend build
cd /home/xserio/e_ticaret_projesi/frontend
npm install
npm run build

# Backend update
cd /home/xserio/e_ticaret_projesi/backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Restart services
sudo systemctl restart eticaret-backend
sudo systemctl restart nginx

echo "Deploy completed at $(date)"
