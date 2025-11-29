#!/usr/bin/env python3
from flask import Flask, request, jsonify
import subprocess
import hmac
import hashlib
import os

app = Flask(__name__)

# GitHub Webhook Secret (bunu GitHub'da da ayarlayacaksın)
WEBHOOK_SECRET = "flux-shop-deploy-secret-2024"

def verify_signature(payload, signature):
    if not signature:
        return False
    expected = 'sha256=' + hmac.new(
        WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)

@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Hub-Signature-256')
    
    if not verify_signature(request.data, signature):
        return jsonify({'error': 'Invalid signature'}), 403
    
    event = request.headers.get('X-GitHub-Event')
    
    if event == 'push':
        payload = request.json
        if payload.get('ref') == 'refs/heads/main':
            # Run deploy script
            subprocess.Popen(['/home/xserio/e_ticaret_projesi/deploy.sh'])
            return jsonify({'status': 'Deploying...'}), 200
    
    return jsonify({'status': 'OK'}), 200

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)
