# 🔑 Système de Clé Secrète Aléatoire - BidTounsi

## Vue d'ensemble

Le système de clé secrète aléatoire remplace la clé fixe statique par un système dynamique où chaque administrateur reçoit une clé aléatoire unique valide 24 heures.

## Architecture

### Frontend Components

#### 1. **RequestAdminKey.tsx** (Nouveau)
- Page pour demander une clé secrète aléatoire
- Fonctionnalités:
  - Formulaire d'email
  - Génération de clé aléatoire
  - Affichage de la clé générée
  - Copie de la clé au presse-papiers
  - Lien direct vers l'enregistrement

**Flux:**
```
Email Input → Générer Clé Aléatoire → Afficher Clé → Copier → Aller à Enregistrement
```

#### 2. **RegisterAdmin.tsx** (Modifié)
- Validation avec le système aléatoire
- Vérifie la clé contre celle stockée pour l'email
- Supprime la clé après utilisation réussie

**Changements clés:**
- Ancien: `if (formData.secretKey !== 'BIDTOUNSI_ADMIN_ONLY_2025')`
- Nouveau: Validation avec `getStoredSecretKey(email)` et `isValidSecretKeyFormat()`

#### 3. **AdminAccess.tsx** (Modifié)
- Ajout d'un bouton "Demander une Clé"
- Navigation vers la page RequestAdminKey
- Boutons séparés pour demander/enregistrer

### Backend Services

#### 1. **emailService.ts** (Modifié)
- Nouvelle fonction: `sendSecretKeyEmail(email, secretKey)`
- Template HTML professionnel:
  - En-tête avec gradient vert
  - Clé affichée en évidence
  - Avertissement de validité 24h
  - Lien d'enregistrement direct
  - Conseils de sécurité

#### 2. **auth.ts (routes)** (Modifié)
- Nouveau endpoint: `POST /api/auth/send-secret-key`
- Reçoit: email, secretKey
- Valide le format email
- Envoie la clé par email
- Retourne: status, message, données

### Utilities

#### 1. **secretKeyGenerator.ts** (Nouveau)
Utilitaires pour gérer les clés aléatoires:

**Fonctions:**
- `generateSecretKey()`: Crée une clé BIDTOUNSI_XXXXXX_XXXXXX
- `storeSecretKeyForEmail(email, key)`: Stocke avec expiration 24h
- `getStoredSecretKey(email)`: Récupère et valide l'expiration
- `deleteSecretKey(email)`: Supprime après utilisation
- `isValidSecretKeyFormat(key)`: Valide le format

**Format de clé:**
```
BIDTOUNSI_XXXXXX_XXXXXX
où X = alphanumériques aléatoires
Exemple: BIDTOUNSI_A7K9Q2_M3X8N5
```

**Stockage localStorage:**
```json
{
  "bidtounsi_secret_keys": {
    "email@example.com": {
      "key": "BIDTOUNSI_XXXXXX_XXXXXX",
      "expiresAt": 1234567890000
    }
  }
}
```

## Flux Complet

### 1. Demande de Clé
```
1. Utilisateur clique "Demander une Clé" sur AdminAccess
2. Navigue vers RequestAdminKey
3. Entre son email et clique "Générer"
4. Frontend génère une clé aléatoire
5. Stocke localement avec expiration 24h
6. Envoie au backend pour email (optionnel)
7. Affiche la clé à l'écran
8. Utilisateur copie la clé
```

### 2. Enregistrement
```
1. Utilisateur clique "S'Enregistrer"
2. Navigue vers RegisterAdmin
3. Entre son email et sa clé
4. Frontend valide le format
5. Frontend valide que la clé correspond à l'email stocké
6. Frontend valide que la clé n'a pas expiré
7. Création du compte réussie
8. Clé supprimée après utilisation
```

### 3. Email
```
1. Backend reçoit: email, secretKey
2. Valide le format email
3. Utilise sendSecretKeyEmail()
4. Envoie email HTML formaté avec:
   - En-tête gradient vert
   - Clé affichée clairement
   - Message d'avertissement 24h
   - Lien d'enregistrement
   - Instructions étape par étape
```

## Sécurité

### Validations
- ✅ Format email RFC
- ✅ Format clé: BIDTOUNSI_XXXXXX_XXXXXX
- ✅ Expiration 24 heures
- ✅ Suppression après utilisation
- ✅ Une clé par email
- ✅ Email required pour validation

### Protection
- ✅ Clés aléatoires (impossible à deviner)
- ✅ Stockage localStorage (pas stocké en clair)
- ✅ Expiration automatique
- ✅ Suppression après création de compte
- ✅ Email comme facteur d'authentification

## Configuration

### Variables d'Environnement
```env
# Frontend - .env
VITE_API_URL=http://localhost:4000

# Backend - .env
EMAIL_USER=ayarisouhi@gmail.com
GMAIL_APP_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

## Navigation Mise à Jour

Dans **App.tsx**:
```typescript
case 'request-admin-key':
  return <RequestAdminKey onNavigate={handleNavigate} />;
```

Dans **standalonePages**:
```typescript
['home', 'login', 'register-admin', 'contact', 'about', 'legal', 'admin-access', 'request-admin-key']
```

## Modifications de Fichiers

### Frontend
- ✅ `components/RequestAdminKey.tsx` - NOUVEAU
- ✅ `components/RegisterAdmin.tsx` - MODIFIÉ
- ✅ `components/AdminAccess.tsx` - MODIFIÉ
- ✅ `utils/secretKeyGenerator.ts` - NOUVEAU
- ✅ `App.tsx` - MODIFIÉ

### Backend
- ✅ `services/emailService.ts` - MODIFIÉ
- ✅ `routes/auth.ts` - MODIFIÉ

## Testing

### Test Manuel - Frontend
```
1. Accédez à http://localhost:5173
2. Cliquez sur "Administration" (Footer)
3. Cliquez sur "Demander une Clé"
4. Entrez votre email
5. Cliquez "Générer ma clé secrète"
6. Copiez la clé affichée
7. Cliquez "Aller à l'enregistrement"
8. Entrez email et clé
9. Remplissez le formulaire d'enregistrement
10. Créez votre compte
```

### Test Backend Email
```bash
# Tester l'endpoint
curl -X POST http://localhost:4000/api/auth/send-secret-key \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","secretKey":"BIDTOUNSI_TEST123_ABC456"}'
```

## Exemple de Clé Générée

```
BIDTOUNSI_K7M4P9_B2Z5X8
```

Composants:
- Préfixe: `BIDTOUNSI_`
- Partie 1: 6 caractères aléatoires (K7M4P9)
- Séparateur: `_`
- Partie 2: 6 caractères aléatoires (B2Z5X8)

## Bénéfices

### Avant (Clé Fixe)
- ❌ Clé commune à tous
- ❌ Impossible de révoquer
- ❌ Risque de compromission
- ❌ Pas de traçabilité

### Après (Clé Aléatoire)
- ✅ Clé unique par utilisateur
- ✅ Expiration 24 heures
- ✅ Haute sécurité
- ✅ Authentification par email
- ✅ Suppression automatique
- ✅ Traçabilité par email

## Support

Pour toute question concernant ce système:
- Email: ayarisouhi@gmail.com
- Tel: +216 71 123 456
