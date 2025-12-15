#!/bin/bash
# Script de démarrage complet pour BidTounsi

echo "🚀 Démarrage de BidTounsi..."

# Vérifier si Docker est disponible
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker Desktop."
    exit 1
fi

echo "📦 Arrêt des conteneurs existants..."
docker-compose down

echo "🔄 Démarrage des services..."
docker-compose up -d

echo "⏳ Attente du démarrage de MongoDB..."
sleep 5

echo "📝 Installation des dépendances backend..."
docker-compose exec -T backend npm install

echo "🔨 Construction du backend..."
docker-compose exec -T backend npm run build

echo "✅ Services démarrés!"
echo ""
echo "📍 Adresses d'accès:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:4000"
echo "   MongoDB: localhost:27017"
echo ""
echo "💡 Commandes utiles:"
echo "   docker-compose logs -f           (voir les logs)"
echo "   docker-compose down              (arrêter les services)"
echo "   docker-compose restart backend   (redémarrer le backend)"
