# 📁 Structure du Projet BidTounsi

## 🎯 Vue d'ensemble
BidTounsi est une plateforme de vente aux enchères de véhicules professionnels avec un système d'authentification local, trois types d'utilisateurs (Admin, Vendeur, Acheteur), et une interface 3D moderne et interactive.

---

## 📂 Architecture des Dossiers

### 🗂️ `/` - Racine du Projet

#### **App.tsx**
- **Rôle** : Point d'entrée principal de l'application React
- **Responsabilités** :
  - Gestion de la navigation entre les pages
  - Initialisation des données de démonstration (seedData)
  - Routing conditionnel basé sur l'état d'authentification
  - Wrapper des providers (AuthContext, NotificationContext)
- **Pages gérées** : home, login, register-admin, dashboard, profile, publish-vehicle

#### **Attributions.md**
- Documentation des crédits et attributions des ressources externes

---

### 🧩 `/components` - Composants React

#### **Pages Publiques**

##### **HomePage.tsx**
- Page d'accueil de l'application
- Assemble : Header, HeroSection, AboutSection, FeaturesSection, StatsSection, Footer
- Point d'entrée pour les visiteurs non authentifiés

##### **HeroSection.tsx**
- Section héros avec effet 3D et parallaxe
- Animations au mouvement de la souris
- Éléments flottants animés
- Bouton CTA vers la connexion
- **Technologie** : Motion/React pour les animations

##### **AboutSection.tsx**
- Présentation de la plateforme BidTounsi
- Grille de 4 bénéfices avec icônes animées
- Cartes 3D interactives au survol
- **Bénéfices** : Simplicité, Sécurité, Rapidité, Rentabilité

##### **FeaturesSection.tsx**
- Fonctionnalités principales de la plateforme
- 4 cartes avec animations 3D au hover
- Rotation des icônes et effets de profondeur
- **Fonctionnalités** : Publier annonces, Enchères, Gestion, Transparence

##### **StatsSection.tsx**
- Statistiques en temps réel depuis localStorage
- Animation de compteur (count-up)
- Effets de glow et backdrop-blur
- **Données** : Véhicules vendus, Entreprises partenaires, Enchères effectuées

##### **Header.tsx**
- En-tête pour les pages publiques
- Logo BidTounsi cliquable
- Boutons "Se connecter" et "Créer un compte"

##### **Footer.tsx**
- Pied de page de l'application
- Informations de contact et liens utiles

---

#### **Authentification**

##### **LoginPage.tsx**
- Page de connexion des utilisateurs
- Validation email/mot de passe
- Affichage des comptes de démonstration
- Bouton de retour à l'accueil avec logo BidTounsi
- Toggle visibilité du mot de passe
- Lien vers création compte admin

##### **RegisterAdmin.tsx**
- Création de comptes administrateur uniquement
- Clé secrète requise : "ADMIN_SECRET_2025"
- Validation des mots de passe
- Bouton de retour à l'accueil avec logo BidTounsi
- Vérification email unique
- Sauvegarde dans localStorage

---

#### **Dashboards Utilisateurs**

##### **DashboardAdmin.tsx**
- **Accès** : Réservé aux administrateurs
- **Fonctionnalités** :
  - Gestion complète des utilisateurs (création, modification, suppression)
  - Visualisation de tous les véhicules et enchères
  - Statistiques globales de la plateforme
  - Système d'onglets (Vue d'ensemble, Utilisateurs, Véhicules, Enchères)
  - Export PDF des rapports de marché
  - Upload de photos de profil pour les utilisateurs
- **Données** : bidtounsi_users, bidtounsi_vehicles, bidtounsi_bids

##### **DashboardVendeur.tsx**
- **Accès** : Vendeurs uniquement
- **Fonctionnalités** :
  - Visualisation de ses propres véhicules
  - Statistiques personnelles (actifs, vendus, enchères reçues)
  - Liste détaillée des véhicules avec statut
  - Suivi des offres reçues par véhicule
  - Bouton vers publication d'annonce
- **Données** : Filtre par sellerId

##### **DashboardAcheteur.tsx**
- **Accès** : Acheteurs uniquement
- **Fonctionnalités** :
  - Catalogue de véhicules disponibles
  - Système de recherche et filtrage
  - Tri (récent, prix croissant/décroissant, fin proche)
  - Historique de ses propres enchères
  - Statut des offres (En attente, Acceptée, Refusée)
  - Placement d'enchères directement
- **Filtres** : Type de véhicule, recherche textuelle

---

#### **Fonctionnalités Métier**

##### **PublishVehicle.tsx**
- **Accès** : Vendeurs uniquement
- **Formulaire** :
  - Informations du véhicule (titre, marque, modèle, année, kilométrage)
  - Prix de départ et prix de réserve
  - Type de véhicule (Voiture, SUV, Camionnette, Camion)
  - Description détaillée
  - Upload de photos multiples (max 5)
  - Date de fin d'enchère (max 30 jours)
- **Validation** : Prix réserve > prix départ
- **Stockage** : localStorage (bidtounsi_vehicles)

##### **ProfilePage.tsx**
- Page de profil utilisateur
- **Sections** :
  - Informations personnelles modifiables
  - Upload de photo de profil (validation base64)
  - Modification du mot de passe
  - Affichage du type de compte
- **Persistance** : Sauvegarde dans localStorage

##### **NotificationCenter.tsx**
- Centre de notifications en temps réel
- Badge avec compteur de notifications non lues
- Popover avec liste des notifications
- Types de notifications :
  - Nouvelle enchère reçue
  - Enchère acceptée/refusée
  - Nouveau véhicule publié
  - Fin d'enchère imminente
- Marquage comme lu
- Suppression de notifications

##### **MarketReportExport.tsx**
- **Accès** : Admin uniquement
- Export PDF des rapports de marché
- **Contenu** :
  - Logo et en-tête BidTounsi
  - Statistiques globales
  - Graphiques (répartition véhicules, tendances prix)
  - Tableaux de données détaillés
- **Technologie** : jsPDF, html2canvas

---

#### **Composants Utilitaires**

##### **AppLayout.tsx**
- Layout pour utilisateurs authentifiés
- **Éléments** :
  - Header avec logo BidTounsi (non cliquable pour authentifiés)
  - Navigation contextuelle selon le type d'utilisateur
  - Avatar avec photo de profil
  - Centre de notifications
  - Bouton de déconnexion
  - Navigation mobile responsive
- **Navigation** : Dashboard, Profil, (Publier annonce pour vendeurs)

##### **Logo.tsx**
- Composant réutilisable du logo BidTounsi
- **Props** :
  - size: 'sm' | 'md' | 'lg'
  - showText: boolean
  - variant: 'default' | 'white'
- Icône de voiture dans carré bleu
- Texte "BidTounsi" avec slogan

---

### 🎨 `/components/ui` - Composants ShadCN UI

Bibliothèque de 50+ composants UI pré-configurés basés sur Radix UI et Tailwind CSS :

#### **Formulaires**
- `input.tsx` : Champs de saisie texte
- `textarea.tsx` : Zones de texte multilignes
- `select.tsx` : Menus déroulants
- `checkbox.tsx` : Cases à cocher
- `radio-group.tsx` : Groupes de boutons radio
- `switch.tsx` : Interrupteurs on/off
- `slider.tsx` : Curseurs de valeur
- `input-otp.tsx` : Champs OTP
- `form.tsx` : Gestion de formulaires avec React Hook Form
- `label.tsx` : Étiquettes de champs

#### **Navigation**
- `button.tsx` : Boutons avec variantes
- `navigation-menu.tsx` : Menus de navigation
- `menubar.tsx` : Barres de menu
- `breadcrumb.tsx` : Fil d'Ariane
- `pagination.tsx` : Pagination de listes
- `tabs.tsx` : Onglets

#### **Affichage**
- `card.tsx` : Cartes de contenu
- `table.tsx` : Tableaux de données
- `avatar.tsx` : Photos de profil
- `badge.tsx` : Badges de statut
- `separator.tsx` : Séparateurs
- `skeleton.tsx` : Placeholders de chargement
- `progress.tsx` : Barres de progression
- `chart.tsx` : Graphiques (Recharts)
- `aspect-ratio.tsx` : Ratios d'image

#### **Overlay**
- `dialog.tsx` : Boîtes de dialogue modales
- `alert-dialog.tsx` : Dialogues de confirmation
- `sheet.tsx` : Panneaux latéraux
- `drawer.tsx` : Tiroirs coulissants
- `popover.tsx` : Popovers
- `hover-card.tsx` : Cartes au survol
- `tooltip.tsx` : Info-bulles
- `dropdown-menu.tsx` : Menus déroulants
- `context-menu.tsx` : Menus contextuels

#### **Feedback**
- `alert.tsx` : Alertes de notification
- `sonner.tsx` : Toast notifications
- `command.tsx` : Palette de commandes

#### **Layout**
- `accordion.tsx` : Accordéons
- `collapsible.tsx` : Sections repliables
- `resizable.tsx` : Panneaux redimensionnables
- `scroll-area.tsx` : Zones de défilement
- `sidebar.tsx` : Barres latérales
- `carousel.tsx` : Carrousels

#### **Autres**
- `calendar.tsx` : Calendrier de sélection de date
- `toggle.tsx` / `toggle-group.tsx` : Boutons bascule

---

### 🖼️ `/components/figma`

##### **ImageWithFallback.tsx**
- Composant d'image avec fallback automatique
- Gestion des erreurs de chargement
- Placeholder par défaut en cas d'échec
- **Utilisation** : Toutes les images de l'application

---

### 🔐 `/contexts` - Contextes React

##### **AuthContext.tsx**
- **Rôle** : Gestion globale de l'authentification
- **État** : Utilisateur connecté, chargement
- **Fonctions** :
  - `login(email, password)` : Connexion
  - `logout()` : Déconnexion
  - `createUser(userData)` : Création d'utilisateur (admin)
  - `updateUser(userData)` : Mise à jour profil
- **Persistance** : localStorage (bidtounsi_users, bidtounsi_currentUser)
- **Initialisation** : Données de démonstration au premier lancement

##### **NotificationContext.tsx**
- **Rôle** : Gestion des notifications en temps réel
- **État** : Liste des notifications
- **Fonctions** :
  - `addNotification(notification)` : Ajouter une notification
  - `markAsRead(id)` : Marquer comme lue
  - `deleteNotification(id)` : Supprimer
  - `getUnreadCount()` : Compter les non lues
- **Persistance** : localStorage (bidtounsi_notifications)
- **Types** : bid_received, bid_accepted, bid_rejected, vehicle_published, auction_ending

---

### 📘 `/types` - Définitions TypeScript

##### **index.ts**
Définition de tous les types de données de l'application :

```typescript
// Types d'utilisateurs
UserType = 'admin' | 'vendeur' | 'acheteur'

// User
interface User {
  id: string
  companyName: string
  email: string
  phone: string
  password: string
  userType: UserType
  createdAt: string
  profilePhoto?: string
}

// Vehicle
interface Vehicle {
  id: string
  sellerId: string
  title: string
  description: string
  vehicleType: 'voiture' | 'suv' | 'camionnette' | 'camion'
  brand: string
  model: string
  year: number
  mileage: number
  startingPrice: number
  reservePrice: number
  currentBid?: number
  status: 'active' | 'ended' | 'sold'
  images: string[]
  endDate: string
  createdAt: string
}

// Bid
interface Bid {
  id: string
  vehicleId: string
  bidderId: string
  amount: number
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

// Notification
interface Notification {
  id: string
  userId: string
  type: 'bid_received' | 'bid_accepted' | 'bid_rejected' | 'vehicle_published' | 'auction_ending'
  title: string
  message: string
  read: boolean
  createdAt: string
  relatedId?: string
}
```

---

### 🛠️ `/utils` - Utilitaires

##### **seedData.ts**
- **Rôle** : Initialisation des données de démonstration
- **Fonction** : `seedInitialData()`
- **Contenu** :
  - 3 utilisateurs de démo (admin, vendeur, acheteur)
  - Quelques véhicules d'exemple
  - Enchères de test
  - Notifications initiales
- **Déclenchement** : Au premier chargement de l'application
- **Vérification** : Ne s'exécute que si localStorage est vide

---

### 🎨 `/styles` - Styles Globaux

##### **globals.css**
- **Configuration Tailwind v4**
- **Tokens de design** :
  - Couleurs (primary, secondary, muted, accent, destructive)
  - Espacements et radius
  - Typographie (font-size, font-weight, line-height)
  - Variables pour mode sombre
- **Utilitaires 3D** :
  - `.perspective-1000` / `.perspective-2000`
  - Animations personnalisées (float, etc.)
- **Scroll fluide** : `scroll-behavior: smooth`
- **Typographie de base** : Styles par défaut pour h1-h4, p, label, button, input

---

### 📚 `/guidelines` - Documentation

##### **Guidelines.md**
- Guide de développement du projet
- Conventions de code
- Architecture de l'application
- Bonnes pratiques

---

## 🗄️ Stockage Local (localStorage)

L'application utilise localStorage pour la persistance des données :

| Clé | Description | Type |
|-----|-------------|------|
| `bidtounsi_users` | Liste de tous les utilisateurs | User[] |
| `bidtounsi_currentUser` | Utilisateur connecté | User |
| `bidtounsi_vehicles` | Catalogue de véhicules | Vehicle[] |
| `bidtounsi_bids` | Toutes les enchères | Bid[] |
| `bidtounsi_notifications` | Notifications utilisateurs | Notification[] |

---

## 🔐 Système d'Authentification

### Flux d'authentification
1. **Connexion** : Vérification email/password dans localStorage
2. **Session** : Stockage de l'utilisateur dans `bidtounsi_currentUser`
3. **Protection** : Routes protégées selon le type d'utilisateur
4. **Déconnexion** : Suppression de la session

### Types d'utilisateurs et permissions

#### 👨‍💼 Admin
- Gestion complète des utilisateurs
- Visualisation de toutes les données
- Export de rapports
- Création de comptes (vendeur, acheteur)

#### 🏢 Vendeur
- Publication d'annonces de véhicules
- Suivi de ses véhicules
- Gestion des offres reçues
- Statistiques personnelles

#### 🛒 Acheteur
- Navigation du catalogue
- Placement d'enchères
- Suivi de ses offres
- Recherche et filtrage

---

## 🎯 Flux Utilisateur

### Visiteur Non Authentifié
1. Arrive sur **HomePage** (Hero 3D, Features, Stats, About)
2. Clic sur "Se connecter" → **LoginPage**
3. Connexion réussie → Redirection vers **Dashboard** (selon type)

### Administrateur
1. **DashboardAdmin** - Vue d'ensemble
2. Gestion des utilisateurs (création, modification, suppression)
3. Suivi des véhicules et enchères
4. Export de rapports PDF
5. **ProfilePage** - Gestion du profil

### Vendeur
1. **DashboardVendeur** - Statistiques personnelles
2. **PublishVehicle** - Publier une annonce
3. Suivi des enchères reçues
4. **ProfilePage** - Gestion du profil

### Acheteur
1. **DashboardAcheteur** - Catalogue de véhicules
2. Recherche et filtrage
3. Placement d'enchères
4. Suivi de l'historique
5. **ProfilePage** - Gestion du profil

---

## 🚀 Technologies Utilisées

### Core
- **React 18** : Framework UI
- **TypeScript** : Typage statique
- **Tailwind CSS v4** : Styling

### Bibliothèques UI
- **ShadCN UI** : Composants pré-configurés
- **Radix UI** : Primitives accessibles
- **Lucide React** : Icônes

### Animations
- **Motion/React** : Animations 3D et transitions
- **CSS Custom Animations** : Effets personnalisés

### Utilitaires
- **jsPDF** : Génération de PDF
- **html2canvas** : Capture d'écran pour PDF
- **date-fns** : Manipulation de dates (si utilisé)

### Stockage
- **localStorage** : Persistance côté client

---

## 📱 Responsive Design

L'application est entièrement responsive avec des breakpoints :
- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

Navigation adaptative :
- Desktop : Header horizontal avec tous les liens
- Mobile : Menu burger avec navigation verticale

---

## 🎨 Système de Design

### Couleurs Principales
- **Primary (Bleu)** : #1D4ED8 - Actions principales, branding
- **Secondary (Vert)** : #10B981 - Succès, confirmations
- **Accent (Orange)** : #F97316 - Éléments d'accent
- **Destructive (Rouge)** : #d4183d - Actions destructives

### Typographie
- **Font principale** : Système (sans-serif)
- **Échelle** : 16px base (personnalisable via CSS variables)
- **Poids** : 400 (normal), 500 (medium), 700 (bold)

### Espacements
- **Radius** : 0.625rem (10px) - Coins arrondis
- **Padding** : Système d'espacements Tailwind (4px incréments)

---

## 🔄 Flux de Données

### Création d'un véhicule
1. Vendeur remplit **PublishVehicle**
2. Données validées
3. Images encodées en base64
4. Sauvegarde dans `bidtounsi_vehicles`
5. Notification aux acheteurs
6. Véhicule apparaît dans **DashboardAcheteur**

### Placement d'enchère
1. Acheteur sélectionne un véhicule
2. Saisit le montant (> prix actuel ou départ)
3. Création d'un objet Bid
4. Sauvegarde dans `bidtounsi_bids`
5. Notification au vendeur
6. Mise à jour du prix actuel si supérieur

### Gestion d'enchère (Vendeur)
1. Vendeur voit les offres dans son dashboard
2. Accepte ou refuse
3. Statut de l'enchère mis à jour
4. Notification à l'acheteur
5. Si acceptée : véhicule marqué comme "sold"

---

## 🛡️ Sécurité

### Limitations actuelles (Démo)
- Authentification locale (pas de backend)
- Pas de chiffrement des mots de passe
- Données en clair dans localStorage
- Pas de validation côté serveur

### Clé secrète Admin
- `ADMIN_SECRET_2025` : Requis pour créer un compte admin
- Empêche la création publique de comptes admin

### Recommandations pour production
- Backend avec API sécurisée
- Authentification JWT
- Hash des mots de passe (bcrypt)
- Validation serveur
- Base de données réelle (PostgreSQL, MongoDB)
- HTTPS obligatoire
- Rate limiting
- CORS configuré

---

## 📦 Dépendances Principales

```json
{
  "dependencies": {
    "react": "^18.x",
    "lucide-react": "latest",
    "motion": "latest",
    "jspdf": "latest",
    "html2canvas": "latest",
    "@radix-ui/react-*": "latest"
  }
}
```

---

## 🎯 Fonctionnalités Clés

✅ **Authentification locale complète**
✅ **Trois types d'utilisateurs avec permissions**
✅ **Gestion de véhicules (CRUD)**
✅ **Système d'enchères en temps réel (localStorage)**
✅ **Notifications push (contexte)**
✅ **Upload de photos (base64)**
✅ **Export PDF des rapports**
✅ **Interface 3D moderne avec animations**
✅ **Design responsive**
✅ **Recherche et filtrage**
✅ **Statistiques en temps réel**
✅ **Profils utilisateurs modifiables**

---

## 🚀 Évolutions Futures Possibles

- Backend API (Node.js, NestJS, Laravel)
- Base de données réelle
- Authentification OAuth
- Paiement intégré (Stripe, PayPal)
- Chat en temps réel entre acheteurs/vendeurs
- Notifications par email
- Historique d'enchères détaillé
- Système de rating/avis
- Dashboard analytics avancé
- Export Excel des données
- Mode sombre complet
- Multilingue (FR, AR, EN)
- Application mobile (React Native)

---

## 📞 Support

Pour toute question sur l'architecture ou le développement, consultez :
- `/guidelines/Guidelines.md`
- Code source commenté dans chaque composant
- Documentation ShadCN UI : https://ui.shadcn.com

---

**Créé avec ❤️ pour BidTounsi - Plateforme N°1 de vente aux enchères de véhicules en Tunisie**
