# 🚀 Guide de Déploiement BidTounsi sur Google Cloud

## Prérequis

- Google Cloud Project créé: `bidtounsi`
- `gcloud` CLI installé
- Authentification: `gcloud auth login`

## Configuration du Projet

```bash
# 1. Définir le projet
gcloud config set project bidtounsi

# 2. Créer App Engine (une seule fois)
gcloud app create --region=europe-west1
```

## Déploiement Automatique

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Exécuter le déploiement
./deploy.sh
```

## Déploiement Manuel

### Backend

```bash
cd backend

# Compiler TypeScript
npm run build

# Déployer
gcloud app deploy app.yaml \
  --set-env-vars \
  EMAIL_USER=ayarisouhi@gmail.com,\
  GMAIL_APP_PASSWORD=benz@1812,\
  FRONTEND_URL=https://bidtounsi.appspot.com,\
  JWT_SECRET=bidtounsi_secret_key_2023

cd ..
```

### Frontend

```bash
cd frontend

# Compiler Vite
npm run build

# Déployer
gcloud app deploy app.yaml \
  --set-env-vars \
  VITE_API_URL=https://backend-dot-bidtounsi.appspot.com

cd ..
```

## Commandes Utiles

```bash
# Voir les logs
gcloud app logs read -n 50 --service=backend
gcloud app logs read -n 50 --service=default

# Voir l'URL de l'application
gcloud app browse

# Arrêter une version
gcloud app versions stop VERSION_ID

# Lister les services
gcloud app services list

# Voir le statut
gcloud app describe

# Supprimer l'application
gcloud app delete
```

## Variables d'Environnement

### Backend (.env)
```env
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/bidtounsi
JWT_SECRET=bidtounsi_secret_key_2023
EMAIL_USER=ayarisouhi@gmail.com
GMAIL_APP_PASSWORD=benz@1812
FRONTEND_URL=https://bidtounsi.appspot.com
```

### Frontend (.env)
```env
VITE_API_URL=https://backend-dot-bidtounsi.appspot.com
```

## Configuration de la Base de Données

### Option 1: MongoDB Atlas (Recommandé)
1. Créer un compte MongoDB Atlas
2. Créer un cluster
3. Obtenir la string de connexion
4. Ajouter à `MONGODB_URI`

### Option 2: Cloud SQL
```bash
# Créer une instance MySQL
gcloud sql instances create bidtounsi-db \
  --database-version=MYSQL_8_0 \
  --region=europe-west1

# Créer une base de données
gcloud sql databases create bidtounsi --instance=bidtounsi-db

# Lister les instances
gcloud sql instances list
```

## Dépannage

### L'app ne se déploie pas
```bash
# Vérifier les logs
gcloud app logs read

# Vérifier la build
npm run build
```

### Erreur de connexion à la base de données
```bash
# Vérifier MONGODB_URI ou Cloud SQL
gcloud sql instances describe bidtounsi-db

# Tester la connexion
gcloud sql connect bidtounsi-db --user=root
```

### Port déjà utilisé
App Engine utilise automatiquement le port 8080

## URLs de Production

- **Frontend**: https://bidtounsi.appspot.com
- **Backend**: https://backend-dot-bidtounsi.appspot.com
- **Contact**: https://bidtounsi.appspot.com/contact
- **Admin**: https://bidtounsi.appspot.com/admin-access

## Coûts

App Engine Free Tier inclut:
- 28 heures/jour pour f1-micro
- Quotas généreux pour les connexions
- Bande passante limitée

## Support

Pour plus d'infos:
- Docs: https://cloud.google.com/appengine
- Console: https://console.cloud.google.com/appengine
