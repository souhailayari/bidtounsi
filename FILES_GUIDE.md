# 📖 Guide Détaillé des Fichiers

## Backend Files

### `backend/src/index.ts`
```
OBJECTIF: Point d'entrée principal du serveur Express

FONCTIONNALITÉS:
  ✓ Configuration Helmet pour sécurité
  ✓ Setup CORS pour communication frontend
  ✓ Middlewares Express (JSON parsing, compression)
  ✓ Rate limiting (100 req/15min)
  ✓ Logging des requêtes en développement
  ✓ Routes API (/api/auth, /api/vehicles)
  ✓ Connexion MongoDB avec gestion erreurs
  ✓ Gestion gracieuse des erreurs

IMPORTS CLÉS:
  express - Framework HTTP
  cors - Cross-Origin requests
  helmet - En-têtes sécurité
  dotenv - Variables d'environnement
  database.connectDB - Connexion MongoDB

UTILISATION:
  npm run dev   → Démarrage développement
  npm run build → Compilation
  npm start     → Production
```

### `backend/src/config/database.ts`
```
OBJECTIF: Gestion de la connexion MongoDB

FONCTIONNALITÉS:
  ✓ Connexion avec reconnexion automatique
  ✓ Timeouts configurés (5s serveur, 45s socket)
  ✓ Singleton pattern (une seule instance)
  ✓ Event listeners (connected, error, disconnected)
  ✓ Gestion des erreurs avec retry logic
  ✓ Support déconnexion propre

EXPORTS:
  connectDB()      - Établit connexion
  disconnectDB()   - Ferme connexion
  getConnection()  - Récupère instance

EXEMPLE:
  const conn = await connectDB();
  // Utiliser conn pour requêtes
  await disconnectDB();
```

### `backend/src/config/security.ts`
```
OBJECTIF: Configuration centralisée de sécurité

CONFIGURATIONS:
  • Rate Limiting:
    - 100 requêtes par IP
    - Fenêtre: 15 minutes
  
  • CORS:
    - Origine: localhost:3000 ou FRONTEND_URL
    - Credentials: true
    - Methods: GET, POST, PUT, DELETE, PATCH
  
  • Helmet Options:
    - CSP directive
    - CORS embedder policy disabled (3D models)

EXPORTS:
  limiter           - Middleware rate limiting
  corsOptions       - Configuration CORS
  helmetOptions     - Configuration Helmet

UTILISATION:
  app.use('/api', limiter);
  app.use(cors(corsOptions));
  app.use(helmet(helmetOptions));
```

### `backend/src/models/User.ts`
```
OBJECTIF: Schéma et logique utilisateur MongoDB

SCHÉMA:
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false  // Exclus par défaut
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'vendeur', 'acheteur'],
      default: 'acheteur'
    },
    phoneNumber: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }

HOOKS:
  pre('save'):
    - Hash password avec bcryptjs (10 rounds)
    - Seulement si password modifié

MÉTHODES:
  comparePassword(candidatePassword):
    - Compare password en clair avec hash
    - Retourne boolean

EXPORTS:
  User - Modèle mongoose

UTILISATION:
  const user = new User({ email, password, name });
  await user.save();
  const valid = await user.comparePassword('password');
```

### `backend/src/models/Vehicle.ts`
```
OBJECTIF: Schéma annonce véhicule MongoDB

SCHÉMA:
  {
    title: String (required, trim),
    description: String (required),
    make: String (required) - Toyota, Peugeot, etc.
    model: String (required) - Corolla, 308, etc.
    year: Number (required, 1900-2026),
    price: Number (required, min: 0),
    seller: ObjectId (ref: 'User', required),
    images: [String],
    features: [String],
    condition: {
      type: String,
      enum: ['new', 'used'],
      required: true
    },
    mileage: Number (min: 0),
    location: String (required),
    status: {
      type: String,
      enum: ['available', 'pending', 'sold'],
      default: 'available'
    }
  }

TIMESTAMPS:
  createdAt - Automatique
  updatedAt - Automatique

UTILISATION:
  const vehicle = new Vehicle({ title, description, ... });
  await vehicle.save();
  vehicle.populate('seller'); // Charger données vendeur
```

### `backend/src/routes/auth.ts`
```
OBJECTIF: Routes authentification utilisateur

ENDPOINTS:

1. POST /api/auth/register
   Body: {
     email: string (unique),
     password: string (8+ chars),
     name: string,
     role?: 'admin' | 'vendeur' | 'acheteur',
     phoneNumber?: string
   }
   Response: {
     status: 'success',
     message: string,
     data: { id, email, name, role }
   }
   Status: 201 | 400 | 409

2. POST /api/auth/login
   Body: { email, password }
   Response: {
     status: 'success',
     data: {
       token: JWT,
       user: { id, email, name, role }
     }
   }
   Status: 200 | 401

SÉCURITÉ:
  • Validation stricte
  • Password hashing pre-save
  • JWT avec expiration 7 jours
  • Pas de password en response
  • Gestion des erreurs robuste
```

### `backend/src/routes/vehicles.ts`
```
OBJECTIF: Routes CRUD véhicules

ENDPOINTS:

1. GET /api/vehicles?status=available&condition=used&minPrice=5000&maxPrice=20000
   Response: { status: 'success', data: [vehicles] }

2. GET /api/vehicles/:id
   Response: { status: 'success', data: vehicle }
   Populate: seller (email, name, phoneNumber)

3. POST /api/vehicles
   Auth: Required ✓
   Body: { title, description, make, model, year, price, seller, ... }
   Response: { status: 'success', data: vehicle }
   Status: 201 | 400

4. PUT /api/vehicles/:id
   Auth: Required ✓
   Body: Champs à modifier
   Response: { status: 'success', data: vehicle }
   Status: 200 | 404

5. DELETE /api/vehicles/:id
   Auth: Required ✓
   Response: { status: 'success' }
   Status: 200 | 404

FILTRES DISPONIBLES:
  • status: available | pending | sold
  • condition: new | used
  • location: String (regex)
  • minPrice / maxPrice: Number
  • sort: -createdAt (par défaut)
```

### `backend/src/middleware/auth.ts`
```
OBJECTIF: Protection et validation JWT

MIDDLEWARE:

1. protect
   - Vérifie présence du token (Authorization header)
   - Valide signature JWT
   - Vérifie expiration
   - Confirme existence de l'utilisateur
   - Renseigne req.user

2. restrictTo(...roles)
   - Restreint access par rôle
   - Vérifie req.user.role
   - 403 si non autorisé

UTILISATION:
  router.post('/private', protect, handleRequest);
  router.delete('/admin', protect, restrictTo('admin'), handleDelete);

JWT PAYLOAD:
  {
    id: string,
    email: string,
    role: string,
    iat: number,
    exp: number
  }
```

### `backend/src/middleware/validation.ts`
```
OBJECTIF: Validation des données entrantes avec Joi

SCHÉMAS:

1. userRegister
   - email: string, email valide
   - password: 8+ chars, uppercase, lowercase, number, special
   - name: string, min 2 chars

2. vehicle
   - title: string, 3-100 chars
   - description: string, min 20 chars
   - price: number, min 0
   - make, model: required
   - year: 1900 - année courante
   - mileage: min 0

USAGE:
  router.post('/register', validateRequest(schemas.userRegister), handler);

ERREURS:
  Status: 400
  Body: {
    status: 'error',
    message: 'Données invalides',
    errors: 'error1, error2'
  }
```

### `backend/src/scripts/seed.ts`
```
OBJECTIF: Charger données de test dans MongoDB

DONNÉES CRÉÉES:

Utilisateurs:
  1. seller@example.com (vendeur)
  2. buyer@example.com (acheteur)
  3. admin@example.com (admin)

Véhicules:
  1. Toyota Corolla 2020 - 15,000 TND
  2. Peugeot 308 2019 - 12,000 TND
  3. Hyundai i10 2021 - 8,500 TND

UTILISATION:
  npm run seed

EFFET:
  • Supprime données existantes
  • Crée nouveaux users et vehicles
  • Affiche statut de succès
```

### `backend/.env` (Développement)
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/bidtounsi
JWT_SECRET=bidtounsi_secret_key_2023
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### `backend/.env.example` (Template)
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/bidtounsi
JWT_SECRET=your-secret-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### `backend/Dockerfile`
```
OBJECTIF: Image Docker pour production

STAGES:

1. Builder
   - Node 18 Alpine
   - Install dépendances
   - Compile TypeScript

2. Runtime
   - Node 18 Alpine (plus petit)
   - Copy des fichiers compilés
   - Port 4000

UTILISATION:
  docker build -t bidtounsi-backend .
  docker run -p 4000:4000 bidtounsi-backend
```

### `backend/package.json`
```
OBJECTIF: Configuration et dépendances du projet

DÉPENDANCES:
  - express: Framework HTTP
  - mongoose: ODM MongoDB
  - typescript: Typage statique
  - jsonwebtoken: Authentification JWT
  - bcryptjs: Hachage mots de passe
  - helmet: Sécurité en-têtes
  - cors: CORS support
  - express-rate-limit: Rate limiting
  - joi: Validation de données
  - dotenv: Variables d'environnement

SCRIPTS:
  npm run dev    - Développement (hot reload)
  npm run build  - Compilation TypeScript
  npm run start  - Production
  npm run seed   - Charger données test
```

---

## Frontend Files

### `frontend/src/main.tsx`
```
OBJECTIF: Point d'entrée React

FONCTIONNALITÉS:
  ✓ Import App composant
  ✓ Rendu dans #root
  ✓ Strict mode pour développement
  ✓ Support Vite HMR

CONTENU:
  - createRoot()
  - render() App
```

### `frontend/src/App.tsx`
```
OBJECTIF: Composant racine application

CONTENEUR:
  ✓ Providers (Auth, Notifications)
  ✓ Router configuration
  ✓ Theme provider
  ✓ Main layout

ROUTES:
  / - Home
  /login - Login
  /register - Register
  /dashboard/:role - Tableau de bord
  /vehicle/:id - Détails véhicule
  /publish - Publier annonce
  /profile - Profil utilisateur
```

### `frontend/src/contexts/AuthContext.tsx`
```
OBJECTIF: Gestion globale authentification

STATE:
  {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    isLoading: boolean
  }

MÉTHODES:
  login(email, password)
  register(userData)
  logout()
  updateUser(data)
  refreshToken()

PERSISTANCE:
  - localStorage pour token
  - Auto-refresh au chargement
  - Expiration 7 jours

UTILISATION:
  const { user, token, login } = useAuth();
```

### `frontend/src/contexts/NotificationContext.tsx`
```
OBJECTIF: Système notification global

TYPES:
  'success' | 'error' | 'warning' | 'info'

MÉTHODES:
  showNotification(type, message, duration)
  clearNotification()
  clearAll()

UTILISATION:
  const { showNotification } = useNotification();
  showNotification('success', 'Succès!');
```

### `frontend/src/utils/api.ts`
```
OBJECTIF: Client API HTTP

FONCTIONNALITÉS:
  ✓ Base URL configurable
  ✓ Token JWT injection automatique
  ✓ Headers par défaut
  ✓ Gestion des erreurs
  ✓ Intercepteurs

MÉTHODES:
  api.get(url, config)
  api.post(url, data, config)
  api.put(url, data, config)
  api.delete(url, config)

SPÉCIALISÉES:
  auth.login(email, password)
  auth.register(userData)
  vehicles.list(filters)
  vehicles.getById(id)
  vehicles.create(data)
  vehicles.update(id, data)
  vehicles.delete(id)
```

### `frontend/src/components/HomePage.tsx`
```
OBJECTIF: Page d'accueil application

SECTIONS:
  ✓ Navigation header
  ✓ Hero section
  ✓ Search bar
  ✓ Featured vehicles grid
  ✓ Categories section
  ✓ Statistics section
  ✓ Call to action
  ✓ Footer

UTILISATION:
  Route: /
  Props: None
  State: véhicules, filtres
```

### `frontend/src/components/LoginPage.tsx`
```
OBJECTIF: Page connexion utilisateur

FORMULAIRE:
  Fields:
    - email (required)
    - password (required)

FONCTIONNALITÉS:
  ✓ Validation côté client
  ✓ Lien vers inscription
  ✓ Gestion des erreurs API
  ✓ Loading state
  ✓ Redirection post-login

UTILISATION:
  Route: /login
  Redirect: /dashboard après succès
```

### `frontend/src/components/PublishVehicle.tsx`
```
OBJECTIF: Formulaire publication annonce

FORMULAIRE:
  Fields:
    - title (required)
    - description (required)
    - make (required)
    - model (required)
    - year (required)
    - price (required)
    - condition (required)
    - mileage (optional)
    - location (required)
    - features (array)
    - images (upload)

VALIDATIONS:
  ✓ Champs requis
  ✓ Prix > 0
  ✓ Année valide
  ✓ Images format/size

UTILISATION:
  Route: /publish
  Auth: Required
  Redirect: /dashboard/:role après succès
```

### `frontend/src/components/DashboardAcheteur.tsx`
```
OBJECTIF: Tableau de bord acheteur

SECTIONS:
  ✓ Annonces sauvegardées
  ✓ Recherches récentes
  ✓ Véhicules visionnés
  ✓ Alertes de prix
  ✓ Comparaison

UTILISATION:
  Route: /dashboard/acheteur
  Auth: Required (role: acheteur)
```

### `frontend/src/components/DashboardVendeur.tsx`
```
OBJECTIF: Tableau de bord vendeur

SECTIONS:
  ✓ Mes annonces (list, edit, delete)
  ✓ Statistiques (vues, clics)
  ✓ Messages reçus
  ✓ Renouveler annonce
  ✓ Créer nouvelle annonce

UTILISATION:
  Route: /dashboard/vendeur
  Auth: Required (role: vendeur)
```

### `frontend/src/components/DashboardAdmin.tsx`
```
OBJECTIF: Tableau de bord admin

SECTIONS:
  ✓ Modération annonces
  ✓ Gestion utilisateurs
  ✓ Statistiques globales
  ✓ Signalements
  ✓ Blocages

UTILISATION:
  Route: /dashboard/admin
  Auth: Required (role: admin)
```

### `frontend/src/components/ProfilePage.tsx`
```
OBJECTIF: Profil utilisateur

SECTIONS:
  ✓ Infos personnelles
  ✓ Adresse de livraison
  ✓ Paramètres de sécurité
  ✓ Préférences
  ✓ Historique transactions

UTILISATION:
  Route: /profile
  Auth: Required
  Method: GET, PUT (update)
```

### `frontend/src/components/ui/` (50+ composants)
```
OBJECTIF: Bibliothèque composants UI réutilisables

COMPOSANTS IMPORTANTS:
  - button.tsx: Boutons
  - input.tsx: Champs texte
  - card.tsx: Cartes conteneur
  - dialog.tsx: Modales
  - form.tsx: Formulaires
  - select.tsx: Listes déroulantes
  - table.tsx: Tableaux données
  - checkbox.tsx: Checkboxes
  - radio-group.tsx: Boutons radio
  - tabs.tsx: Onglets
  - etc...

UTILISATION:
  import { Button } from '@/components/ui/button'
  <Button>Click me</Button>
```

### `frontend/src/types/index.ts`
```
OBJECTIF: Types TypeScript centralisés

TYPES PRINCIPAUX:

User {
  id: string
  email: string
  name: string
  role: 'admin' | 'vendeur' | 'acheteur'
  phoneNumber?: string
  createdAt: Date
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
  status: 'available' | 'pending' | 'sold'
  createdAt: Date
  updatedAt: Date
}

ApiResponse<T> {
  status: 'success' | 'error'
  message: string
  data?: T
  errors?: string[]
}
```

### `frontend/src/styles/globals.css`
```
OBJECTIF: Styles CSS globaux

CONTENEUR:
  ✓ CSS Reset
  ✓ Variables CSS
  ✓ Base styles (html, body)
  ✓ Animations globales
  ✓ Responsive breakpoints
  ✓ Dark mode (optionnel)
  ✓ Utilities
```

### `frontend/Dockerfile`
```
OBJECTIF: Image Docker frontend production

STAGES:

1. Builder
   - Node 18 Alpine
   - npm install
   - npm run build

2. Server
   - Node 18 Alpine
   - serve (serveur static)
   - Port 3000

UTILISATION:
  docker build -t bidtounsi-frontend .
  docker run -p 3000:3000 bidtounsi-frontend
```

### `frontend/package.json`
```
OBJECTIF: Configuration et dépendances

DÉPENDANCES:
  - react: UI library
  - react-dom: DOM rendering
  - vite: Build tool ultra-rapide
  - typescript: Typage
  - tailwindcss: CSS utilities
  - axios: HTTP client
  - react-router: Routage SPA
  - zustand (optionnel): State management

SCRIPTS:
  npm run dev    - Développement
  npm run build  - Production build
  npm run preview - Préview build
```

---

## Configuration & Root Files

### `docker-compose.yml`
```
OBJECTIF: Orchestrer services Docker

SERVICES:

1. mongodb
   - Image: mongo:6.0
   - Port: 27017
   - Volumes: mongodb_data
   - Healthcheck: ping

2. backend
   - Build: ./backend/Dockerfile
   - Port: 4000
   - Env: NODE_ENV, MONGODB_URI, JWT_SECRET
   - Depends on: mongodb
   - Health: depends_on condition

3. frontend
   - Build: ./frontend/Dockerfile
   - Port: 3000
   - Env: VITE_API_URL
   - Depends on: backend

UTILISATION:
  docker-compose up --build
  docker-compose down
```

### `.gitignore`
```
OBJECTIF: Fichiers à ignorer Git

CONTENU:
  - node_modules/
  - dist/
  - build/
  - .env (fichiers secrets)
  - .cache/
  - .DS_Store
  - *.log
  - coverage/
```

### `package.json` (Root)
```
OBJECTIF: Configuration root projet

SCRIPTS:
  npm run dev       - Dev backend + frontend
  npm run backend   - Juste backend
  npm run frontend  - Juste frontend
  npm run build     - Build tout
  npm run start     - Production start

DÉPENDANCES:
  - concurrently: Lancer plusieurs commandes
```

### `start-all.bat`
```
OBJECTIF: Script démarrage Windows

ACTIONS:
  1. Vérifier MongoDB service
  2. Nettoyer anciens processes
  3. Lancer Backend (fenêtre)
  4. Lancer Frontend (fenêtre)
  5. Afficher URLs accès

UTILISATION:
  .\start-all.bat
```

### `start-all.ps1`
```
OBJECTIF: Script démarrage PowerShell (meilleur)

ACTIONS:
  1. Vérifier MongoDB
  2. Démarrer MongoDB si nécessaire
  3. Nettoyer processes
  4. Lancer Backend
  5. Lancer Frontend

UTILISATION:
  .\start-all.ps1
```

### `clean.bat`
```
OBJECTIF: Nettoyer le projet

ACTIONS:
  1. Supprimer backend/node_modules
  2. Supprimer backend/dist
  3. Supprimer frontend/node_modules
  4. Supprimer frontend/dist
  5. Supprimer lock files

UTILISATION:
  .\clean.bat
  npm install (après pour réinstaller)
```

### Documentation Files

- **README.md** - Presentation projet & guide démarrage
- **RUNNING.md** - Guide complet utilisation
- **CLEANUP.md** - Notes nettoyage effectué
- **PROJECT_DOCS.md** - Documentation technique complète
- **FILES_GUIDE.md** - Ce fichier (détails chaque fichier)

---

**Dernière mise à jour :** 15 Novembre 2025
