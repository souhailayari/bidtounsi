# 📧 Configuration Email - BidTounsi Admin Key System

## Variables d'Environnement Requises

Ajoutez ces variables à votre fichier `.env`:

```env
# ========== EMAIL CONFIGURATION ==========
# Service d'email SMTP

# Option 1: Gmail
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password  # Pas votre mot de passe Gmail normal!
EMAIL_FROM=noreply@bidtounsi.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Option 2: Gmail avec App Password
# 1. Aller sur: https://myaccount.google.com/apppasswords
# 2. Créer une "App Password"
# 3. Copier le password généré (16 caractères)
# 4. Utiliser ce password dans EMAIL_PASSWORD

# Option 3: Autres services (SendGrid, Mailgun, etc.)
# Adapter SMTP_HOST, SMTP_PORT, EMAIL_USER, EMAIL_PASSWORD

# Option 4: Service personnalisé
SMTP_HOST=smtp.votre-domaine.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=votre-email@votre-domaine.com
EMAIL_PASSWORD=votre-mot-de-passe
EMAIL_FROM=noreply@votre-domaine.com

# ========== FRONTEND URL ==========
FRONTEND_URL=http://localhost:3000
# Ou en production:
# FRONTEND_URL=https://bidtounsi.com
```

---

## 🔐 Configuration Gmail (Recommandé)

### Étape 1: Activer l'authentification à deux facteurs
1. Aller à: https://myaccount.google.com
2. Sécurité → Vérification en deux étapes

### Étape 2: Générer App Password
1. Aller à: https://myaccount.google.com/apppasswords
2. Sélectionner: Mail + Windows Computer
3. Cliquer: "Générer"
4. Copier le password (16 caractères)

### Étape 3: Utiliser dans .env
```env
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Sans les espaces: xxxxxxxxxxxxxxxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

---

## 🧪 Tester la Configuration

### Depuis la Console Node:
```javascript
const emailService = require('./src/services/emailService');

// Tester la connexion
await emailService.testEmailConnection();
// Affichera: "✓ Email service is ready"
```

### Depuis cURL:
```bash
curl -X POST http://localhost:4000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "name": "Admin Name",
    "phoneNumber": "+216 95 123 456"
  }'
```

---

## 📨 Système de Clés Admin

### Génération Automatique
Quand un admin s'inscrit via `/api/admin/register`:
1. ✅ Compte créé en base de données
2. ✅ Clé secrète générée: `BT-XXXXXXXX-XXXXXXXX-XXXXXXXX`
3. ✅ Email envoyé avec la clé
4. ✅ Clé valide 90 jours

### Endpoints Disponibles

#### 1. Créer un Admin (avec clé)
```
POST /api/admin/register
Content-Type: application/json

{
  "email": "admin@bidtounsi.com",
  "password": "SecurePass123!",
  "name": "Admin Name",
  "phoneNumber": "+216 95 123 456"
}

Response 201:
{
  "status": "success",
  "message": "Compte administrateur créé. Clé secrète envoyée par email.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@bidtounsi.com",
    "name": "Admin Name",
    "role": "admin",
    "adminKeyGenerated": true,
    "emailSent": true
  }
}
```

#### 2. Renvoyer la Clé Admin
```
POST /api/admin/resend-key
Content-Type: application/json

{
  "email": "admin@bidtounsi.com"
}

Response 200:
{
  "status": "success",
  "message": "Nouvelle clé envoyée par email",
  "data": {
    "adminKeyGenerated": true,
    "emailSent": true
  }
}
```

#### 3. Vérifier l'État de la Clé
```
GET /api/admin/key-status/admin@bidtounsi.com

Response 200:
{
  "status": "success",
  "data": {
    "adminId": "507f1f77bcf86cd799439011",
    "email": "admin@bidtounsi.com",
    "name": "Admin Name",
    "hasActiveKey": true,
    "keyExpiresAt": "2026-02-13T10:00:00.000Z"
  }
}
```

---

## 📧 Format de l'Email Envoyé

L'email contient:
- 🔑 **Clé Admin Secrète** (en évidence)
- ⚠️ **Avertissement de sécurité**
- 📋 **Conseils de sécurité**
- 🔗 **Lien vers la plateforme**
- 📞 **Contact support**

Exemple de clé:
```
BT-A7F2B4E1-C9D3E6F8-1A2B3C4D
```

---

## 🔒 Sécurité

### Points Importants:
1. **Clé générée aléatoirement** avec crypto
2. **Email chiffré** en transit
3. **Clé expirée après 90 jours**
4. **Une seule clé active** par admin
5. **Impossible de récupérer une clé perdue**
6. **Log de tous les accès admin**

### Bonnes Pratiques:
- ✅ Stocker la clé dans un gestionnaire de mots de passe
- ✅ Ne jamais partager la clé
- ✅ Changer régulièrement de mot de passe
- ✅ Utiliser 2FA quand disponible
- ✅ Signaler tout accès suspect

---

## 🚀 Installation des Dépendances

```bash
cd backend
npm install nodemailer
npm install --save-dev @types/nodemailer
```

---

## 📝 Notes

- Les emails sont optionnels (le système fonctionne sans SMTP)
- Si SMTP n'est pas configuré, les clés sont générées mais pas envoyées
- Les messages d'erreur SMTP sont loggés dans la console
- En développement, vous pouvez vérifier les clés en base de données

---

**Besoin d'aide? Consultez la documentation ou contactez: support@bidtounsi.com**
