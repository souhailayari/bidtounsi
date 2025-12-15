#!/bin/bash

# Script de déploiement BidTounsi sur Google Cloud

set -e

PROJECT_ID="bidtounsi"
REGION="europe-west1"

echo "🚀 Déploiement de BidTounsi sur Google Cloud"
echo "=========================================="

# 1. Définir le projet
echo "1️⃣  Configuration du projet..."
gcloud config set project $PROJECT_ID

# 2. Compiler le backend
echo "2️⃣  Compilation du backend..."
cd backend
npm run build
cd ..

# 3. Compiler le frontend
echo "3️⃣  Compilation du frontend..."
cd frontend
npm run build
cd ..

# 4. Déployer le backend
echo "4️⃣  Déploiement du backend..."
cd backend
gcloud app deploy app.yaml \
  --set-env-vars \
  EMAIL_USER=ayarisouhi@gmail.com,\
  GMAIL_APP_PASSWORD=benz@1812,\
  FRONTEND_URL=https://bidtounsi.appspot.com,\
  JWT_SECRET=bidtounsi_secret_key_2023
cd ..

# 5. Déployer le frontend
echo "5️⃣  Déploiement du frontend..."
cd frontend
gcloud app deploy app.yaml \
  --set-env-vars \
  VITE_API_URL=https://backend-dot-bidtounsi.appspot.com
cd ..

# 6. Afficher l'URL
echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "URLs:"
echo "Frontend: https://bidtounsi.appspot.com"
echo "Backend: https://backend-dot-bidtounsi.appspot.com"
echo "Logs: gcloud app logs read -n 50"
