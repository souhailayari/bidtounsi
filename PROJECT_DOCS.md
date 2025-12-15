# 📚 Documentation Complète - BidTounsi Marketplace

## 📋 Table des Matières

1. [Vue d'ensemble du projet](#vue-densemble)
2. [Architecture](#architecture)
3. [Structure des dossiers](#structure-des-dossiers)
4. [Backend](#backend)
5. [Frontend](#frontend)
6. [Configuration](#configuration)
7. [Déploiement](#déploiement)
8. [API Documentation](#api-documentation)

---

## 🎯 Vue d'ensemble

**BidTounsi** est une marketplace automobile complète permettant aux utilisateurs de :
- 📱 Publier des annonces de vente/location de véhicules
- 🔍 Rechercher et filtrer les annonces
- 💰 Gérer les transactions sécurisées
- 👤 Gérer leur profil et préférences
- 🌍 Utiliser une interface multilingue (AR, FR, EN)

### Stack Technologique

```
Frontend:  React 18 + Vite + TypeScript + Tailwind CSS
Backend:   Express.js + TypeScript + MongoDB
DevOps:    Docker + Docker Compose
Auth:      JWT + bcryptjs
```

---

## 🏗️ Architecture

### Architecture Générale

```
┌─────────────────────────────────────────────────────────┐
│                   Client Web (React)                     │
│              http://localhost:3000                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────┐
│              API Backend (Express)                       │
│              http://localhost:4000                       │
│                                                          │
│  • Authentication Routes (/api/auth)                    │
│  • Vehicle Routes (/api/vehicles)                       │
│  • User Routes (à implémenter)                          │
└────────────────────┬────────────────────────────────────┘
                     │ TCP/MongoDB Protocol
┌────────────────────▼────────────────────────────────────┐
│            MongoDB Database                             │
│       mongodb://localhost:27017/bidtounsi                 │
│                                                          │
│  Collections:                                           │
│  • users      - Profils utilisateurs                    │
│  • vehicles   - Annonces de véhicules                   │
└─────────────────────────────────────────────────────────┘
```

### Flux d'Authentification

```
1. Utilisateur -> Register/Login (POST /api/auth/register|login)
2. Backend -> Hash password + Valide données
3. Backend -> Crée JWT token
4. Client -> Stocke token en localStorage
5. Client -> Envoie token dans Authorization header
6. Backend -> Vérifie token + Accorde accès
```

---

## 📁 Structure des Dossiers

### Racine du Projet

```
bidtounsi/
├── backend/                    # Code serveur Express
├── frontend/                   # Code client React
├── docker-compose.yml          # Orchestration Docker
├── package.json               # Dépendances root
├── .gitignore                 # Fichiers ignorés Git
├── clean.bat                  # Script de nettoyage
├── start-all.bat              # Démarrage Windows
├── start-all.ps1              # Démarrage PowerShell
├── README.md                  # Documentation principale
├── RUNNING.md                 # Guide de démarrage
├── CLEANUP.md                 # Notes de nettoyage
└── PROJECT_DOCS.md            # Ce fichier
```

---

## 🖥️ Backend

### 📂 Structure Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts        # Connexion MongoDB
│   │   └── security.ts        # Config sécurité
│   ├── middleware/
│   │   ├── auth.ts            # Protection JWT
│   │   ├── security.ts        # Rate limiting
│   │   └── validation.ts      # Validation données
│   ├── models/
│   │   ├── User.ts            # Schéma utilisateur
│   │   └── Vehicle.ts         # Schéma véhicule
│   ├── routes/
│   │   ├── auth.ts            # Routes auth
│   │   └── vehicles.ts        # Routes véhicules
│   ├── scripts/
│   │   └── seed.ts            # Données de test
│   └── index.ts               # Point d'entrée
├── .env                       # Variables dev
├── .env.example              # Template
├── .env.production           # Config production
├── Dockerfile                # Image Docker
├── package.json              # Dépendances
├── tsconfig.json             # Config TypeScript
├── README.md                 # Docs backend
├── MONGODB_CONFIG.md         # Config DB
└── node_modules/             # Dépendances installées
```

### 🔧 Fichiers Backend Détaillés

#### `src/index.ts` - Point d'Entrée Principal
**Responsabilité :** Initialiser et démarrer le serveur Express

**Conteneur :**
- Configuration de Helmet (sécurité)
- Configuration CORS
- Middlewares de sécurité (rate limiting)
- Routes API
- Connexion MongoDB avec gestion d'erreurs

**Variables d'environnement requises :**
```
PORT, MONGODB_URI, JWT_SECRET, NODE_ENV, FRONTEND_URL
```

#### `src/config/database.ts` - Configuration MongoDB
**Responsabilité :** Gérer la connexion à MongoDB

**Fonctionnalités :**
- Connexion avec reconnexion automatique (5 tentatives)
- Gestion des événements (connecté, déconnecté, erreur)
- Singleton pattern (une seule connexion)
- Timeouts configurés

**Exports :**
```typescript
connectDB()      - Connecter à MongoDB
disconnectDB()   - Fermer la connexion
getConnection()  - Récupérer la connexion active
```

#### `src/config/security.ts` - Configuration de Sécurité
**Responsabilité :** Définir les configurations de sécurité

**Éléments configurés :**
- Rate limiting (100 req/15min)
- CORS (origine contrôlée)
- Helmet (en-têtes HTTP)

#### `src/models/User.ts` - Schéma Utilisateur
**Responsabilité :** Définir la structure et validation des utilisateurs

**Schéma :**
```typescript
{
  email:       string (unique, indexed)
  password:    string (hashed, 8+ chars)
  name:        string (required)
  role:        'admin' | 'vendeur' | 'acheteur'
  phoneNumber: string (optional)
  createdAt:   Date
  timestamps:  { createdAt, updatedAt }
}
```

**Méthodes :**
```typescript
comparePassword(password)  - Comparer mot de passe
```

**Hooks :**
```typescript
pre('save')  - Hash le mot de passe avant sauvegarde
```

#### `src/models/Vehicle.ts` - Schéma Véhicule
**Responsabilité :** Définir la structure des annonces de véhicules

**Schéma :**
```typescript
{
  title:       string
  description: string
  make:        string (marque: Toyota, Peugeot, etc.)
  model:       string (Corolla, 308, etc.)
  year:        number
  price:       number
  seller:      ObjectId (ref to User)
  images:      [string]
  features:    [string]
  condition:   'new' | 'used'
  mileage:     number (optional)
  location:    string
  status:      'available' | 'pending' | 'sold'
  timestamps:  { createdAt, updatedAt }
}
```

#### `src/routes/auth.ts` - Routes d'Authentification
**Responsabilité :** Gérer l'authentification des utilisateurs

**Endpoints :**

```
POST /api/auth/register
├─ Body: { email, password, name, role?, phoneNumber? }
├─ Validation: Email unique, password 8+ chars
├─ Response: { status, message, data: { id, email, name, role } }
└─ Status: 201 (created) | 400 (validation) | 409 (exists)

POST /api/auth/login
├─ Body: { email, password }
├─ Validation: Credentials valides
├─ Response: { status, message, data: { token, user } }
└─ Status: 200 (success) | 401 (invalid)
```

**Sécurité :**
- Validation stricte
- Password hashing avec bcryptjs
- JWT avec expiration 7j
- Gestion des erreurs robuste

#### `src/routes/vehicles.ts` - Routes des Véhicules
**Responsabilité :** CRUD complet pour les véhicules

**Endpoints :**

```
GET /api/vehicles
├─ Params: ?status=available&condition=used&minPrice=5000&maxPrice=20000
├─ Response: { status, data: [vehicles] }
└─ Filtres: status, condition, location, price range

GET /api/vehicles/:id
├─ Response: { status, data: vehicle }
└─ Populate: seller details

POST /api/vehicles
├─ Auth: ✓ Requis
├─ Body: { title, description, make, model, year, price, seller, ... }
├─ Response: { status, message, data: vehicle }
└─ Status: 201 (created) | 400 (validation)

PUT /api/vehicles/:id
├─ Auth: ✓ Requis
├─ Body: Champs à modifier
├─ Response: { status, message, data: vehicle }
└─ Status: 200 (updated) | 404 (not found)

DELETE /api/vehicles/:id
├─ Auth: ✓ Requis
├─ Response: { status, message }
└─ Status: 200 (deleted) | 404 (not found)
```

#### `src/middleware/auth.ts` - Protection JWT
**Responsabilité :** Vérifier et protéger les routes

**Middlewares :**
```typescript
protect         - Vérifie JWT token valide
restrictTo()    - Restreint par rôle (admin, vendor, buyer)
```

**Vérifications :**
- Token présent dans Authorization header
- Token valide et non expiré
- Utilisateur existe encore
- Mot de passe pas changé après émission du token

#### `src/middleware/validation.ts` - Validation des Données
**Responsabilité :** Valider les entrées utilisateur

**Schémas :**
```typescript
userRegister   - Validation inscription
vehicle        - Validation véhicule
```

**Règles :**
- Email format valide
- Password: 8+ chars, uppercase, lowercase, number, special char
- Prix minimum 0
- Année entre 1900 et année courante

#### `src/scripts/seed.ts` - Données de Test
**Responsabilité :** Charger les données initiales

**Utilisation :**
```bash
npm run seed
```

**Données créées :**
- 3 utilisateurs (vendeur, acheteur, admin)
- 3 véhicules d'exemple avec toutes les données

#### `package.json` - Dépendances Backend

**Dépendances Principales :**
```json
{
  "express": "Framework HTTP",
  "mongoose": "ODM MongoDB",
  "typescript": "Typage statique",
  "jsonwebtoken": "Authentification JWT",
  "bcryptjs": "Hachage mots de passe",
  "helmet": "Sécurité en-têtes HTTP",
  "cors": "Partage de ressources",
  "express-rate-limit": "Rate limiting",
  "joi": "Validation données"
}
```

**Scripts :**
```bash
npm run dev      # Développement avec hot reload
npm run build    # Compilation TypeScript
npm run start    # Production
npm run seed     # Charger données de test
```

---

## ⚛️ Frontend

### 📂 Structure Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                     # Composants UI
│   │   ├── figma/                  # Composants Figma
│   │   ├── AboutSection.tsx        # À propos
│   │   ├── AuthContext.tsx         # Contexte auth
│   │   ├── HomePage.tsx            # Page accueil
│   │   ├── LoginPage.tsx           # Page connexion
│   │   ├── ProfilePage.tsx         # Profil utilisateur
│   │   ├── PublishVehicle.tsx      # Publier annonce
│   │   ├── DashboardAcheteur.tsx   # Tableau de bord acheteur
│   │   ├── DashboardVendeur.tsx    # Tableau de bord vendeur
│   │   ├── DashboardAdmin.tsx      # Tableau de bord admin
│   │   └── ... (autres composants)
│   ├── contexts/
│   │   ├── AuthContext.tsx         # Gestion authentification
│   │   └── NotificationContext.tsx # Notifications
│   ├── utils/
│   │   ├── api.ts                  # Client API
│   │   ├── 3dModels.ts             # Gestion modèles 3D
│   │   └── seedData.ts             # Données initiales
│   ├── types/
│   │   └── index.ts                # Types TypeScript
│   ├── styles/
│   │   └── globals.css             # Styles globaux
│   ├── public/
│   │   └── models/                 # Modèles 3D
│   ├── App.tsx                     # Composant racine
│   ├── main.tsx                    # Point d'entrée
│   └── index.css                   # CSS principal
├── index.html                      # HTML template
├── vite.config.ts                  # Config Vite
├── package.json                    # Dépendances
├── tsconfig.json                   # Config TypeScript
├── Dockerfile                      # Image Docker
├── README.md                       # Docs frontend
└── node_modules/                   # Dépendances
```

### 🔧 Fichiers Frontend Détaillés

#### `src/main.tsx` - Point d'Entrée
**Responsabilité :** Initialiser l'application React

**Conteneur :**
- Import du composant App principal
- Rendu dans #root
- Configuration Vite HMR

#### `src/App.tsx` - Composant Racine
**Responsabilité :** Routage et layout principal

**Conteneur :**
- Fournisseurs (AuthContext, NotificationContext)
- Routage (React Router)
- Thème global
- Layout application

#### `src/contexts/AuthContext.tsx` - Gestion Authentification
**Responsabilité :** Gérer l'état d'authentification global

**État :**
```typescript
{
  user: {
    id: string
    email: string
    name: string
    role: 'admin' | 'vendeur' | 'acheteur'
  } | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
```

**Méthodes :**
```typescript
login(email, password)        - Connexion
register(data)                - Inscription
logout()                      - Déconnexion
updateUser(userData)          - Mise à jour profil
```

**Persistance :**
- Token en localStorage
- Récupération au chargement
- Refresh automatique si expiré

#### `src/contexts/NotificationContext.tsx` - Notifications
**Responsabilité :** Gérer les notifications utilisateur

**Types :**
```typescript
{
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}
```

**Méthodes :**
```typescript
showNotification(notification)    - Afficher
clearNotification()               - Effacer
```

#### `src/utils/api.ts` - Client API
**Responsabilité :** Communiquer avec le backend

**Fonctionnalités :**
- Base URL configurable
- Gestion du token JWT
- Headers automatiques
- Gestion des erreurs
- Intercepteurs

**Méthodes :**
```typescript
fetchVehicles(filters)        - Récupérer véhicules
getVehicleById(id)            - Détails véhicule
createVehicle(data)           - Créer annonce
updateVehicle(id, data)       - Modifier annonce
deleteVehicle(id)             - Supprimer annonce
login(email, password)        - Connexion
register(userData)            - Inscription
```

#### `src/components/HomePage.tsx` - Page d'Accueil
**Responsabilité :** Afficher la page principale

**Sections :**
- Hero section
- Recherche/Filtres
- Annonces populaires
- Appel à l'action
- Footer

#### `src/components/LoginPage.tsx` - Page de Connexion
**Responsabilité :** Formulaire de connexion

**Formulaire :**
```
Email (required)
Password (required)
```

**Fonctionnalités :**
- Validation côté client
- Lien inscription
- Gestion des erreurs
- Redirection post-login

#### `src/components/PublishVehicle.tsx` - Publication Annonce
**Responsabilité :** Formulaire de publication

**Formulaire :**
```
Titre (requis)
Description (requis)
Marque (requis)
Modèle (requis)
Année (requis)
Prix (requis)
Condition (requis)
Kilométrage
Localisation (requis)
Caractéristiques (array)
Images (upload)
```

**Validations :**
- Tous les champs requis
- Format email valide
- Prix positif
- Année valide

#### `src/components/DashboardAcheteur.tsx` - Tableau Acheteur
**Responsabilité :** Afficher les favoris et recherches sauvegardées

**Conteneur :**
- Annonces sauvegardées
- Historique recherches
- Comparaison véhicules
- Alertes prix

#### `src/components/DashboardVendeur.tsx` - Tableau Vendeur
**Responsabilité :** Gestion des annonces vendeur

**Fonctionnalités :**
- Lister ses annonces
- Modifier annonces
- Supprimer annonces
- Statistiques (vues, clics)
- Renouveler annonces

#### `src/components/DashboardAdmin.tsx` - Tableau Admin
**Responsabilité :** Gestion administrative

**Fonctionnalités :**
- Modérer les annonces
- Gérer les utilisateurs
- Statistiques globales
- Signalements/Blocages

#### `src/components/ProfilePage.tsx` - Profil Utilisateur
**Responsabilité :** Gestion profil utilisateur

**Sections :**
- Informations personnelles
- Adresse
- Préférences
- Historique transactions
- Paramètres de confidentialité

#### `src/components/ui/` - Composants UI Réutilisables
**Responsabilité :** Bibliothèque de composants

**Composants :**
```
button.tsx        - Boutons
input.tsx         - Champs texte
card.tsx          - Cartes
dialog.tsx        - Modales
form.tsx          - Formulaires
select.tsx        - Listes déroulantes
... (50+ composants)
```

**Utilisation :** Import et utilisation dans d'autres composants

#### `src/types/index.ts` - Types TypeScript
**Responsabilité :** Définir les types globaux

**Types :**
```typescript
User {
  id: string
  email: string
  name: string
  role: UserRole
  phoneNumber?: string
}

Vehicle {
  id: string
  title: string
  description: string
  make: string
  model: string
  year: number
  price: number
  seller: User
  condition: 'new' | 'used'
  mileage?: number
  location: string
  features: string[]
  images: string[]
  status: VehicleStatus
}

ApiResponse<T> {
  status: 'success' | 'error'
  message: string
  data?: T
}
```

#### `src/styles/globals.css` - Styles Globaux
**Responsabilité :** Styles CSS application-wide

**Conteneur :**
- Réinitialisation CSS
- Variables CSS
- Styles HTML/Body
- Animations globales
- Responsive breakpoints

#### `package.json` - Dépendances Frontend

**Dépendances Principales :**
```json
{
  "react": "UI library",
  "react-dom": "DOM rendering",
  "vite": "Build tool",
  "typescript": "Typage",
  "tailwindcss": "Styles utilitaires",
  "axios": "HTTP client",
  "react-router": "Routage",
  "zustand": "State management (optionnel)"
}
```

**Scripts :**
```bash
npm run dev       # Développement
npm run build     # Production
npm run preview   # Aperçu build
npm run lint      # Linter
```

---

## ⚙️ Configuration

### Variables d'Environnement

#### Backend `.env`

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/bidtounsi

# Authentication
JWT_SECRET=your-secret-jwt-key-change-in-production

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Backend `.env.production`

```env
PORT=443
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bidtounsi
JWT_SECRET=use-strong-random-secret-in-production
FRONTEND_URL=https://yourdomain.com
```

#### Frontend `.env.local`

```env
VITE_API_URL=http://localhost:4000
```

### Fichiers de Configuration

#### `tsconfig.json` (Backend)

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

#### `vite.config.ts` (Frontend)

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
})
```

#### `docker-compose.yml`

Orchestre 3 services :
1. **MongoDB** - Base de données
2. **Backend** - API Express
3. **Frontend** - Application React

---

## 🚀 Déploiement

### Docker

#### Build

```bash
# Frontend
cd frontend
docker build -t bidtounsi-frontend .

# Backend
cd backend
docker build -t bidtounsi-backend .
```

#### Run avec Docker Compose

```bash
docker-compose up --build
```

Services :
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- MongoDB: localhost:27017

### Déploiement Production

#### Option 1 : Heroku

```bash
# Backend
cd backend
heroku create bidtounsi-backend
heroku config:set MONGODB_URI=...
git push heroku main

# Frontend
cd frontend
heroku create bidtounsi-frontend
npm run build
git push heroku main
```

#### Option 2 : AWS EC2

```bash
# SSH
ssh -i key.pem ec2-user@instance

# Install
curl https://nodejs.org/dist/v18.0.0/node-v18.0.0-linux-x64.tar.xz | tar xJ

# Clone & Setup
git clone ...
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build

# Start
pm2 start dist/index.js
```

#### Option 3 : Vercel + Railway

```bash
# Frontend -> Vercel
npm i -g vercel
vercel deploy

# Backend -> Railway
railway link
railway up
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:4000
```

### Headers Requis

```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN  (pour routes protégées)
```

### Authentication Endpoints

#### Inscription
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "acheteur",
  "phoneNumber": "+216 95 123 456"
}

Response 201:
{
  "status": "success",
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "acheteur"
  }
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response 200:
{
  "status": "success",
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "acheteur"
    }
  }
}
```

### Vehicle Endpoints

#### Lister les Véhicules
```http
GET /api/vehicles?status=available&condition=used&minPrice=5000&maxPrice=20000

Response 200:
{
  "status": "success",
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "title": "Toyota Corolla 2020",
      "description": "Voiture bien entretenue",
      "price": 15000,
      "location": "Tunis",
      "condition": "used",
      "status": "available",
      "seller": {
        "id": "507f1f77bcf86cd799439011",
        "email": "seller@example.com",
        "name": "Ahmed Seller"
      }
    }
  ]
}
```

#### Créer une Annonce
```http
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
  "images": ["https://example.com/img1.jpg"]
}

Response 201:
{
  "status": "success",
  "message": "Véhicule créé avec succès",
  "data": { ... vehicle object ... }
}
```

---

## 🔒 Sécurité

### Implémentations

- ✅ **HTTPS/TLS** - En production
- ✅ **JWT** - Token authentification
- ✅ **bcryptjs** - Hachage mots de passe
- ✅ **CORS** - Restriction origine
- ✅ **Helmet** - En-têtes sécurité
- ✅ **Rate Limiting** - Protection DoS
- ✅ **Input Validation** - Côté serveur
- ✅ **SQL/NoSQL Injection** - Paramètres préparés
- ✅ **XSS Protection** - Sanitization
- ✅ **CSRF Tokens** - (à implémenter)

### Bonnes Pratiques

1. **Secrets**
   - Jamais en Git
   - Utiliser fichiers .env
   - Variables d'environnement en production

2. **Mots de Passe**
   - Minimum 8 caractères
   - Uppercase, lowercase, numbers, symbols
   - Hashage 10 rounds bcryptjs

3. **Tokens JWT**
   - Expiration 7 jours
   - Refresh token en cookie
   - Révocation en base de données

4. **CORS**
   - Lister les domaines autorisés
   - Vérifier Origin header
   - Limiter les verbes HTTP

5. **Logs**
   - Erreurs et tentatives échouées
   - Pas de données sensibles
   - Rotation régulière

---

## 📊 Base de Données

### Modèle de Données

```
┌─────────────────────────────────────┐
│ Collection: users                   │
├─────────────────────────────────────┤
│ _id: ObjectId                       │
│ email: String (unique, index)       │
│ password: String (hashed)           │
│ name: String                        │
│ role: String (enum)                 │
│ phoneNumber: String                 │
│ createdAt: Date (index)             │
│ updatedAt: Date                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Collection: vehicles                │
├─────────────────────────────────────┤
│ _id: ObjectId                       │
│ title: String                       │
│ description: String                 │
│ make: String                        │
│ model: String                       │
│ year: Number                        │
│ price: Number (index)               │
│ seller: ObjectId (ref users)        │
│ condition: String (enum)            │
│ mileage: Number                     │
│ location: String (index)            │
│ features: [String]                  │
│ images: [String]                    │
│ status: String (enum)               │
│ createdAt: Date (index)             │
│ updatedAt: Date                     │
└─────────────────────────────────────┘
```

### Indexes

```javascript
// Users
db.users.createIndex({ email: 1 })
db.users.createIndex({ createdAt: -1 })

// Vehicles
db.vehicles.createIndex({ price: 1 })
db.vehicles.createIndex({ location: 1 })
db.vehicles.createIndex({ seller: 1 })
db.vehicles.createIndex({ createdAt: -1 })
db.vehicles.createIndex({ status: 1, condition: 1 })
```

---

## 🧪 Tests

### Test Manuel API

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123!",
    "name":"Test User"
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123!"
  }'

# List Vehicles
curl http://localhost:4000/api/vehicles

# Create Vehicle
curl -X POST http://localhost:4000/api/vehicles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ ... vehicle data ... }'
```

### Charger Données de Test

```bash
cd backend
npm run seed
```

---

## 🔄 Workflow Développement

### Démarrage Local

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Accès
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
```

### Build Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Commits Git

```bash
git add .
git commit -m "feat: description du changement"
git push origin main
```

### Branches

```
main          - Production
develop       - Intégration
feature/*     - Nouvelles fonctionnalités
bugfix/*      - Corrections
release/*     - Préparation release
```

---

## 📚 Ressources Additionnelles

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [JWT.io](https://jwt.io/)

---

**Dernière mise à jour :** 15 Novembre 2025
**Version :** 1.0.0
