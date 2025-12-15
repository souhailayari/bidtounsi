# Script de démarrage pour Windows

Write-Host "🚀 Démarrage de BidTounsi..." -ForegroundColor Green

# Vérifier si Docker est disponible
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Docker n'est pas installé. Veuillez installer Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Arrêt des conteneurs existants..." -ForegroundColor Yellow
docker-compose down

Write-Host "🔄 Démarrage des services..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "⏳ Attente du démarrage de MongoDB..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "📝 Installation des dépendances backend..." -ForegroundColor Yellow
docker-compose exec -T backend npm install

Write-Host "🔨 Construction du backend..." -ForegroundColor Yellow
docker-compose exec -T backend npm run build

Write-Host "✅ Services démarrés!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Adresses d'accès:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000"
Write-Host "   Backend API: http://localhost:4000"
Write-Host "   MongoDB: localhost:27017"
Write-Host ""
Write-Host "💡 Commandes utiles:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f           (voir les logs)"
Write-Host "   docker-compose down              (arrêter les services)"
Write-Host "   docker-compose restart backend   (redémarrer le backend)"
