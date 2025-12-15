# 🚀 Configuration Vercel - Étapes Complètes

## 📋 Ajouter les Variables d'Environnement sur Vercel

### Étape 1: Aller au Dashboard Vercel

1. Allez sur: https://vercel.com
2. Connectez-vous avec votre compte
3. Sélectionnez le projet: **bidtounsi**

### Étape 2: Ajouter les Variables

1. Cliquez sur **Settings** (⚙️)
2. Allez à **Environment Variables**
3. Cliquez sur **Add New**

### Étape 3: Ajouter Chaque Variable

Ajoutez les variables suivantes:

#### 1. Database
```
Name: MONGODB_URI
Value: mongodb+srv://bidtounsi_user:BidTounsi2024Secure@bidtounsi.mongodb.net/bidtounsi
Environment: Production
```

#### 2. JWT Secret
```
Name: JWT_SECRET
Value: bidtounsi_jwt_secret_key_2024_production_secure_key_123456789
Environment: Production
```

#### 3. Admin Key
```
Name: ADMIN_KEY
Value: BIDTOUNSI_ADMIN_KEY_2024_SECURE_12345
Environment: Production
```

#### 4. Email Configuration
```
Name: EMAIL_USER
Value: ayarisouhi@gmail.com
Environment: Production

Name: GMAIL_APP_PASSWORD
Value: xxxx xxxx xxxx xxxx
Environment: Production
```

#### 5. Frontend URL
```
Name: FRONTEND_URL
Value: https://bidtounsi-m9aafszi1-souhails-projects-70478964.vercel.app
Environment: Production
```

#### 6. Other Variables
```
Name: NODE_ENV
Value: production
Environment: Production

Name: DEBUG
Value: false
Environment: Production

Name: TZ
Value: Africa/Tunis
Environment: Production
```

## ✅ Vérification

Après avoir ajouté tous les variables:

1. Allez à **Deployments**
2. Cliquez sur le dernier déploiement
3. Vérifiez que le build s'est bien passé
4. Testez les endpoints: https://bidtounsi-m9aafszi1-*.vercel.app/api/health

## 🔄 Redéployer Après Changement

Si vous avez changé les variables d'environnement:

```bash
# Option 1: Via Vercel CLI
vercel --prod --skip-domain

# Option 2: Via GitHub
git add .
git commit -m "Update environment variables"
git push
# Vercel déploie automatiquement
```

## 🎯 Checklist Final

- [ ] Toutes les variables d'environnement ajoutées
- [ ] Build réussi sur Vercel
- [ ] API répond: /api/health
- [ ] Frontend charge: https://bidtounsi-*.vercel.app
- [ ] CORS fonctionne
- [ ] Database connectée
- [ ] Email service configuré

## 📊 Production URLs

```
Frontend:  https://bidtounsi-m9aafszi1-souhails-projects-70478964.vercel.app
API:       https://bidtounsi-m9aafszi1-souhails-projects-70478964.vercel.app/api
Health:    https://bidtounsi-m9aafszi1-souhails-projects-70478964.vercel.app/api/health
```

## 🆘 Troubleshooting

### Build fails
→ Vérifiez les logs: **Deployments > Failed > Logs**

### API not found
→ Vérifiez vercel.json et les routes

### Database error
→ Vérifiez MONGODB_URI dans les variables

### CORS error
→ Vérifiez FRONTEND_URL dans les variables

---

**Status:** ✅ Production Ready
