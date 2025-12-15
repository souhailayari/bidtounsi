# Configuration MongoDB pour BidTounsi

## Variables d'environnement requises

```env
# Développement local
MONGODB_URI=mongodb://localhost:27017/bidtounsi
NODE_ENV=development

# Production (MongoDB Atlas)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bidtounsi?retryWrites=true&w=majority
```

## Configuration de la connexion

La connexion MongoDB est gérée dans `src/config/database.ts` avec:

- **Reconnexion automatique**: Jusqu'à 5 tentatives avec délai de 3 secondes
- **Timeouts**: 
  - serverSelectionTimeoutMS: 5000ms
  - socketTimeoutMS: 45000ms
- **Événements**: Logging connecté/déconnecté/erreur

## Collections

### Users
- email (unique, indexed)
- password (hashed with bcryptjs)
- name
- role (user, vendor, admin)
- phoneNumber
- createdAt (indexed)

### Vehicles
- title
- description
- make, model, year
- price
- seller (référence User)
- condition (new, used)
- mileage
- location
- features (array)
- images (array)
- status (available, pending, sold)
- timestamps

## Commandes utiles

### Lancer le seeder (données de test)
```bash
npm run seed
```

### Compilation TypeScript
```bash
npm run build
```

### Production
```bash
npm run start
```

## Migration vers MongoDB Atlas

1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster (tier free disponible)
3. Obtenir la chaîne de connexion
4. Mettre à jour `.env`:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/bidtounsi?retryWrites=true&w=majority
```

## Sécurité

- Les mots de passe sont hashés avec bcryptjs (10 rounds)
- Les connexions support les credentials
- Rate limiting sur l'API (100 requêtes/15min)
- Validation des données entrantes
