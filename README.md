# BidTounsi - Marketplace Automobile

Plateforme de vente et location de voitures d'occasion avec paiement sécurisé.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js >= 18
- MongoDB >= 5.0
- npm >= 9

### Installation Développement

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

Le projet sera accessible à:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 📁 Structure du Projet

```
bidtounsi/
├── backend/           # Express + TypeScript + MongoDB
│   ├── src/
│   │   ├── config/    # Configuration (DB, sécurité)
│   │   ├── models/    # Schémas MongoDB (User, Vehicle)
│   │   ├── routes/    # Routes API (auth, vehicles)
│   │   ├── middleware/# Middlewares (auth, validation)
│   │   └── index.ts   # Fichier principal
│   ├── .env          # Variables d'environnement
│   └── package.json
├── frontend/         # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/# Composants React
│   │   ├── contexts/  # Contexts (Auth, Notifications)
│   │   ├── utils/     # Utilitaires (API client)
│   │   └── types/     # Types TypeScript
│   └── package.json
└── package.json      # Root package.json
```

## 🔧 Configuration

### Variables d'Environnement Backend

Créez un fichier `.env` dans le dossier `backend`:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/bidtounsi
JWT_SECRET=your-secret-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Variables d'Environnement Frontend

Créez un fichier `.env.local` dans le dossier `frontend`:

```env
VITE_API_URL=http://localhost:4000
```

## 📦 Installation MongoDB

### Sur Windows
```powershell
# Si MongoDB n'est pas installé
# Télécharger: https://www.mongodb.com/try/download/community

# Démarrer le service
net start MongoDB

# Vérifier la connexion
mongo
```

### Avec Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🔐 Authentification

L'API utilise JWT pour l'authentification.

### Endpoints Auth

**Inscription**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe",
  "role": "acheteur",
  "phoneNumber": "+216 95 123 456"
}
```

**Connexion**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Réponse**
```json
{
  "status": "success",
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "acheteur"
    }
  }
}
```

## 🚗 Endpoints Vehicles

**Lister tous les véhicules**
```bash
GET /api/vehicles?status=available&condition=used&minPrice=5000&maxPrice=20000
```

**Créer un véhicule**
```bash
POST /api/vehicles
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "Toyota Corolla 2020",
  "description": "Voiture en bon état",
  "make": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "price": 15000,
  "seller": "USER_ID",
  "condition": "used",
  "mileage": 45000,
  "location": "Tunis",
  "features": ["Climatisation", "ABS"],
  "images": ["url1", "url2"]
}
```

**Récupérer un véhicule**
```bash
GET /api/vehicles/:id
```

**Mettre à jour un véhicule**
```bash
PUT /api/vehicles/:id
Authorization: Bearer YOUR_TOKEN
```

**Supprimer un véhicule**
```bash
DELETE /api/vehicles/:id
Authorization: Bearer YOUR_TOKEN
```

## 🔒 Sécurité

- ✅ Helmet pour les en-têtes HTTP
- ✅ CORS configuré
- ✅ Rate limiting (100 requêtes/15min)
- ✅ Hachage des mots de passe (bcryptjs)
- ✅ JWT pour l'authentification
- ✅ Validation des données entrantes

## 📊 Base de Données

### Collections

**Users**
- email (unique, indexed)
- password (hashed)
- name
- role (admin, vendeur, acheteur)
- phoneNumber
- createdAt

**Vehicles**
- title
- description
- make, model, year
- price
- seller (ref to User)
- condition (new, used)
- mileage
- location
- features (array)
- images (array)
- status (available, pending, sold)
- timestamps

## 🧪 Tests

### Données de Test

Pour charger des données de test:
```bash
cd backend
npm run seed
```

### Test manuel avec cURL

```bash
# Inscription
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Connexion
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

## 🚀 Déploiement Production

### Build

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Serveurs recommandés

**Backend (Node.js)**
- Heroku
- Railway
- Render
- DigitalOcean
- AWS EC2

**Frontend**
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

**Base de données**
- MongoDB Atlas (cloud)
- Self-hosted MongoDB
- AWS DocumentDB

### Variables d'environnement Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/bidtounsi
JWT_SECRET=strong-random-secret-key
FRONTEND_URL=https://bidtounsi.com
PORT=443
```

## 📝 Logs et Monitoring

Les logs sont affichés dans la console. Pour la production, intégrez:
- Winston pour la gestion des logs
- Sentry pour le monitoring
- New Relic pour la performance

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 📞 Support

Pour toute question ou problème, contactez: support@bidtounsi.com

---

**Fait avec ❤️ par l'équipe BidTounsi**
