# 🔑 Système de Clé Admin Secrète - Guide Complet

## 📊 Vue d'Ensemble

Le système génère automatiquement une **clé secrète admin aléatoire** lors de la création d'un compte administrateur et l'envoie **par email sécurisé**.

### Flux:
```
1. Admin s'inscrit → POST /api/admin/register
2. Compte créé en DB
3. Clé générée: BT-XXXXXXXX-XXXXXXXX-XXXXXXXX
4. Email envoyé avec la clé
5. Admin reçoit l'email
6. Admin utilise la clé pour accès admin
```

---

## 🚀 Utilisation

### Étape 1: Configurer l'Email

**Fichier: `backend/.env`**

Exemple avec Gmail:
```env
# Email Configuration
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App Password
EMAIL_FROM=noreply@bidtounsi.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
FRONTEND_URL=http://localhost:3000
```

### Étape 2: Créer un Compte Admin

**Via API:**
```bash
curl -X POST http://localhost:4000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bidtounsi.com",
    "password": "SecurePass123!",
    "name": "Karim Admin",
    "phoneNumber": "+216 95 123 456"
  }'
```

**Réponse Succès:**
```json
{
  "status": "success",
  "message": "Compte administrateur créé. Clé secrète envoyée par email.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@bidtounsi.com",
    "name": "Karim Admin",
    "role": "admin",
    "adminKeyGenerated": true,
    "emailSent": true
  }
}
```

### Étape 3: Vérifier l'Email

L'admin reçoit un email avec:
- ✅ Clé Admin: `BT-A7F2B4E1-C9D3E6F8-1A2B3C4D`
- ✅ Conseils de sécurité
- ✅ Lien de connexion
- ✅ Avertissements

---

## 🔐 Clé Admin - Détails

### Format
```
BT-XXXXXXXX-XXXXXXXX-XXXXXXXX
├─ BT       : Préfixe BidTounsi
├─ 8 hex    : Partie 1 (aléatoire)
├─ 8 hex    : Partie 2 (aléatoire)
└─ 8 hex    : Partie 3 (aléatoire)
```

Exemple réel:
```
BT-3A7F2B4E-C9D3E6F8-1A2B3C4D
```

### Propriétés
| Propriété | Valeur |
|-----------|--------|
| **Longueur** | 29 caractères |
| **Format** | Hexadécimal + séparateurs |
| **Génération** | Crypto aléatoire sécurisée |
| **Validité** | 90 jours |
| **Usage** | Une seule fois active |
| **Réinitialisation** | Via `/api/admin/resend-key` |

---

## 📨 Emails Envoyés

### Email de Création Admin

**Objet:** 🔑 Votre Clé Admin BidTounsi - Accès Sécurisé

**Contient:**
```
Bienvenue admin!
Votre compte administrateur a été créé.

━━━━━━━━━━━━━━━━━━━━━━━━━━━
Votre Clé Admin Secrète
━━━━━━━━━━━━━━━━━━━━━━━━━━━
BT-3A7F2B4E-C9D3E6F8-1A2B3C4D

⚠️ Conservez cette clé en sécurité. 
   Elle ne sera jamais renvoyée.

✓ Utilisation: Opérations admin sensibles
✓ Validité: 90 jours
✓ Accédez: http://localhost:3000/login

Informations de Sécurité:
• Ne partagez jamais votre clé admin
• Changez votre mot de passe régulièrement
• Utilisez une authentification forte
• Signalez tout accès suspect
```

---

## 🔄 Gestion des Clés

### 1. Renvoyer une Clé Perdue

**Si l'admin perd son email:**

```bash
curl -X POST http://localhost:4000/api/admin/resend-key \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@bidtounsi.com"}'
```

Génère et envoie une **nouvelle clé**.

### 2. Vérifier l'État de la Clé

```bash
curl http://localhost:4000/api/admin/key-status/admin@bidtounsi.com
```

Réponse:
```json
{
  "status": "success",
  "data": {
    "adminId": "507f1f77bcf86cd799439011",
    "email": "admin@bidtounsi.com",
    "name": "Karim Admin",
    "hasActiveKey": true,
    "keyExpiresAt": "2026-02-13T10:00:00.000Z"
  }
}
```

### 3. Historique des Clés (MongoDB)

**Voir toutes les clés d'un admin:**

```javascript
db.adminkeys.find({ adminId: ObjectId("507f1f77bcf86cd799439011") })
```

**Résultat:**
```javascript
[
  {
    _id: ObjectId("..."),
    key: "BT-3A7F2B4E-C9D3E6F8-1A2B3C4D",
    adminId: ObjectId("507f1f77bcf86cd799439011"),
    email: "admin@bidtounsi.com",
    name: "Karim Admin",
    createdAt: ISODate("2025-11-15T10:00:00Z"),
    expiresAt: ISODate("2026-02-13T10:00:00Z"),
    isUsed: false,
    usedAt: null
  }
]
```

---

## 🔒 Sécurité et Bonnes Pratiques

### ✅ Sécurité Intégrée

1. **Génération Aléatoire**
   - Utilise `crypto.randomBytes()`
   - Impossible de prédire
   - 32 bits d'entropie par segment

2. **Stockage Sécurisé**
   - Clés stockées en MongoDB
   - Pas de chiffrement (stockage simple)
   - Index sur la clé pour validation rapide

3. **Validation**
   - Clé vérifie: existence + non-expiration + non-utilisée
   - TTL MongoDB nettoie automatiquement

4. **Email Sécurisé**
   - Utilise SMTP TLS
   - Pas de clé en logs
   - Email HTML + texte brut

### 📋 Checklist Sécurité

Pour chaque admin:
- [ ] Clé reçue par email
- [ ] Clé sauvegardée dans gestionnaire de mots de passe
- [ ] Clé JAMAIS partagée
- [ ] Email de confirmation reçu
- [ ] Accès admin testé
- [ ] 2FA activé si disponible
- [ ] Mot de passe fort (8+ chars)

### ⚠️ Points d'Attention

```
❌ NE PAS:
   - Partager la clé
   - Envoyer par email non-sécurisé
   - Stocker en texte brut
   - Utiliser comme mot de passe

✅ À FAIRE:
   - Stocker dans gestionnaire de mots de passe
   - Utiliser pour accès admin sensible
   - Renouveler annuellement
   - Signaler si exposée
```

---

## 🛠️ Configuration Avancée

### Changer l'Expiration (défaut: 90 jours)

**File: `backend/src/utils/adminKeyUtils.ts`**

```typescript
// Changer de 90 à 180 jours:
expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
```

### Changer le Format de la Clé

```typescript
// Exemple: format plus court
export function generateAdminKey(): string {
  return 'BT-' + crypto.randomBytes(12).toString('hex').toUpperCase();
  // Résultat: BT-A7F2B4E1C9D3E6F81A2B
}
```

### Ajouter des Permissions à la Clé

**File: `backend/src/models/AdminKey.ts`**

```typescript
permissions: [String], // Exemple: ['users.manage', 'payments.view']
ipWhitelist: [String], // Limiter à certaines IPs
lastUsedAt: Date,
usageCount: Number,
```

---

## 🧪 Tests

### Test 1: Créer un Admin et Recevoir la Clé

```bash
# Créer l'admin
curl -X POST http://localhost:4000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-admin@example.com",
    "password": "TestPass123!",
    "name": "Test Admin"
  }'

# Vérifier l'email reçu
# Chercher: "BT-XXXXXXXX-XXXXXXXX-XXXXXXXX"
```

### Test 2: Renvoyer la Clé

```bash
curl -X POST http://localhost:4000/api/admin/resend-key \
  -H "Content-Type: application/json" \
  -d '{"email": "test-admin@example.com"}'
```

### Test 3: Vérifier l'État

```bash
curl http://localhost:4000/api/admin/key-status/test-admin@example.com
```

---

## 📊 Base de Données - Schéma AdminKey

```javascript
{
  _id: ObjectId,
  key: String,              // BT-XXXXXXXX-XXXXXXXX-XXXXXXXX
  adminId: ObjectId,        // Référence à User (admin)
  email: String,            // admin@bidtounsi.com
  name: String,             // Nom complet
  createdAt: Date,          // Quand générée
  expiresAt: Date,          // Expiration (90 jours par défaut)
  isUsed: Boolean,          // Utilisée ou pas
  usedAt: Date              // Quand utilisée (si applicable)
}
```

---

## 🚀 Prochaines Étapes

1. **Installation**
   ```bash
   npm install nodemailer
   ```

2. **Configuration**
   - Ajouter EMAIL_* au .env
   - Tester la connexion SMTP

3. **Déploiement**
   - Créer le premier admin
   - Tester la réception d'email
   - Valider la clé en MongoDB

4. **Maintenance**
   - Surveiller les emails non envoyés
   - Nettoyer les clés expirées
   - Monitorer les accès admin

---

## 📞 Support

Pour toute question ou problème:
1. Vérifier les logs backend
2. Tester la connexion SMTP
3. Valider les variables .env
4. Consulter la documentation
5. Contacter: support@bidtounsi.com

---

**Système de Clé Admin de BidTounsi - Sécurisé et Automatisé ✅**
