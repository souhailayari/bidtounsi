# 🔧 Fix 404 Error - Ajouter les Variables d'Environnement

## ⚠️ Problème
Erreur 404 sur Vercel car les variables d'environnement ne sont pas configurées.

## ✅ Solution

### Étape 1: Aller au Dashboard Vercel

1. Ouvrez: https://vercel.com/souhails-projects-70478964/bidtounsi
2. Cliquez sur **Settings** (⚙️)
3. Allez à **Environment Variables**

### Étape 2: Ajouter Chaque Variable

Pour chaque variable ci-dessous, cliquez sur **Add New** et remplissez:

#### Variable 1: MONGODB_URI
```
Name: MONGODB_URI
Value: mongodb+srv://bidtounsi_user:BidTounsi2024Secure@bidtounsi.mongodb.net/bidtounsi
Environment: Production ✓
```
Cliquez **Add**

#### Variable 2: JWT_SECRET
```
Name: JWT_SECRET
Value: bidtounsi_jwt_secret_key_2024_production_secure_key_123456789
Environment: Production ✓
```
Cliquez **Add**

#### Variable 3: ADMIN_KEY
```
Name: ADMIN_KEY
Value: BIDTOUNSI_ADMIN_KEY_2024_SECURE_12345
Environment: Production ✓
```
Cliquez **Add**

#### Variable 4: EMAIL_USER
```
Name: EMAIL_USER
Value: ayarisouhi@gmail.com
Environment: Production ✓
```
Cliquez **Add**

#### Variable 5: GMAIL_APP_PASSWORD
```
Name: GMAIL_APP_PASSWORD
Value: (votre app password Gmail)
Environment: Production ✓
```
Cliquez **Add**

#### Variable 6: FRONTEND_URL
```
Name: FRONTEND_URL
Value: https://bidtounsi-m9aafszi1-souhails-projects-70478964.vercel.app
Environment: Production ✓
```
Cliquez **Add**

#### Variable 7: NODE_ENV
```
Name: NODE_ENV
Value: production
Environment: Production ✓
```
Cliquez **Add**

#### Variable 8: DEBUG
```
Name: DEBUG
Value: false
Environment: Production ✓
```
Cliquez **Add**

#### Variable 9: TZ
```
Name: TZ
Value: Africa/Tunis
Environment: Production ✓
```
Cliquez **Add**

### Étape 3: Redéployer

1. Allez à **Deployments**
2. Cliquez sur le dernier déploiement
3. Cliquez **Redeploy** en haut à droite
4. Attendez 2-3 minutes

### Étape 4: Vérifier

Allez à: https://bidtounsi-m9aafszi1-souhails-projects-70478964.vercel.app/api/health

Vous devriez voir: `{"status":"ok","timestamp":"..."}`

---

## 📸 Captures d'écran (étapes)

1. Settings → Environment Variables
2. Add New → Remplir le formulaire
3. Environment: Production
4. Cliquer Add
5. Redeploy après avoir ajouté toutes les variables

---

## ✅ Checklist

- [ ] MONGODB_URI ajoutée
- [ ] JWT_SECRET ajoutée
- [ ] ADMIN_KEY ajoutée
- [ ] EMAIL_USER ajoutée
- [ ] GMAIL_APP_PASSWORD ajoutée
- [ ] FRONTEND_URL ajoutée
- [ ] NODE_ENV ajoutée
- [ ] DEBUG ajoutée
- [ ] TZ ajoutée
- [ ] Redeploy effectué
- [ ] /api/health répond

---

## 🆘 Aide

Si vous n'êtes pas sûr:
1. Consultez: PRODUCTION_CONFIG.md
2. Consultez: VERCEL_SETUP.md
3. Consultez: COMPLETE_SETUP.md
