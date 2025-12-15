# 🚀 BidTounsi - Projet en Mode Production

## ✅ Statut du Projet

### Serveurs Actifs
- ✓ **Frontend** : http://localhost:3000
- ✓ **Backend API** : http://localhost:4000
- ✓ **MongoDB** : mongodb://localhost:27017/bidtounsi

---

## 🎯 Points d'Accès

### Frontend
```
http://localhost:3000
```
- Interface utilisateur complète
- Authentification
- Gestion des annonces

### Backend API
```
http://localhost:4000
```

#### Routes d'Authentification
```
POST   /api/auth/register  - Créer un compte
POST   /api/auth/login     - Se connecter
```

#### Routes des Véhicules
```
GET    /api/vehicles              - Lister tous les véhicules
GET    /api/vehicles/:id          - Détails d'un véhicule
POST   /api/vehicles              - Créer une annonce
PUT    /api/vehicles/:id          - Modifier une annonce
DELETE /api/vehicles/:id          - Supprimer une annonce
```

---

## 🧪 Tests API Rapides

### Inscription
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"Password123!",
    "name":"John Doe",
    "role":"acheteur"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"Password123!"
  }'
```

### Lister les Véhicules
```bash
curl http://localhost:4000/api/vehicles
```

---

## 📁 Structure du Projet

```
bidtounsi/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration (DB, sécurité)
│   │   ├── models/        # Modèles MongoDB
│   │   ├── routes/        # Routes API
│   │   ├── middleware/    # Middlewares
│   │   └── index.ts       # Point d'entrée
│   ├── .env              # Variables d'environnement
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Composants React
│   │   ├── contexts/     # Contexts (Auth, Notifications)
│   │   ├── utils/        # Utilitaires
│   │   └── types/        # Types TypeScript
│   └── package.json
│
├── start-all.bat          # Script de démarrage (Windows)
├── start-all.ps1          # Script PowerShell
├── docker-compose.yml     # Configuration Docker
└── README.md             # Documentation complète
```

---

## 🔐 Sécurité Implémentée

- ✓ Authentification JWT
- ✓ Hachage bcryptjs des mots de passe
- ✓ CORS configuré
- ✓ Helmet pour les en-têtes HTTP
- ✓ Rate limiting (100 req/15min)
- ✓ Validation des données
- ✓ Gestion des erreurs robuste

---

## 📦 Technologies Utilisées

### Backend
- **Framework** : Express.js
- **Langage** : TypeScript
- **Base de données** : MongoDB
- **Authentification** : JWT + bcryptjs
- **Validation** : Joi
- **Sécurité** : Helmet, CORS, Rate Limiting

### Frontend
- **Framework** : React 18
- **Build Tool** : Vite
- **Langage** : TypeScript
- **Styles** : CSS + Tailwind
- **Gestion d'état** : Context API

---

## 🚀 Commandes Principales

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Les deux simultanément (Windows)
.\start-all.bat

# Ou avec PowerShell
.\start-all.ps1
```

### Production
```bash
# Build
npm run build:backend
npm run build:frontend

# Docker
docker-compose up --build
```

---

## 🗄️ Base de Données

### Collections MongoDB

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
- seller (référence User)
- condition (new, used)
- mileage
- location
- features
- images
- status (available, pending, sold)
- timestamps

---

## ⚙️ Configuration

### Variables d'Environnement Backend (.env)
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/bidtounsi
JWT_SECRET=your-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Variables d'Environnement Frontend (.env.local)
```
VITE_API_URL=http://localhost:4000
```

---

## 🐛 Dépannage

### MongoDB ne démarre pas
```bash
# Windows
net start MongoDB

# Ou vérifier le statut
Get-Service MongoDB
```

### Port déjà utilisé
```bash
# Tuer les processus Node
taskkill /F /IM node.exe

# Ou spécifier un port différent dans .env
PORT=5000
```

### Problèmes de connexion API
1. Vérifier que le backend est démarré
2. Vérifier que MongoDB est en cours d'exécution
3. Vérifier la variable VITE_API_URL dans le frontend

---

## 📞 Support

Pour toute question, consultez la documentation complète dans `README.md`

---

**Projet BidTounsi - Marketplace Automobile**
*Fait avec ❤️ par l'équipe de développement*
