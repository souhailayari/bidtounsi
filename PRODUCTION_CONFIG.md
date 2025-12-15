# 🔐 Configuration Centralisée - BidTounsi Production

## 📌 URLs Principales

```
Frontend:  https://bidtounsi-m9aafszi1-souhails-projects-70478964.vercel.app
Backend:   https://bidtounsi-m9aafszi1-souhails-projects-70478964.vercel.app/api
Dashboard: https://vercel.com/souhails-projects-70478964/bidtounsi
GitHub:    https://github.com/souhailayari/bidtounsi
```

## 🔑 Variables d'Environnement

### Backend (.env ou Vercel)

```env
# Database
MONGODB_URI=mongodb+srv://bidtounsi_user:BidTounsi2024Secure@bidtounsi.mongodb.net/bidtounsi

# Authentication
JWT_SECRET=bidtounsi_jwt_secret_key_2024_production_secure_key_123456789
ADMIN_KEY=BIDTOUNSI_ADMIN_KEY_2024_SECURE_12345

# Email
EMAIL_USER=ayarisouhi@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# URLs
FRONTEND_URL=https://bidtounsi-m9aafszi1-souhails-projects-70478964.vercel.app
API_URL=https://bidtounsi-m9aafszi1-souhails-projects-70478964.vercel.app/api

# Configuration
PORT=4000
NODE_ENV=production
DEBUG=false
TZ=Africa/Tunis
```

### Frontend (.env.production ou .env.local)

```env
VITE_API_URL=https://bidtounsi-m9aafszi1-souhails-projects-70478964.vercel.app/api
VITE_APP_NAME=BidTounsi
VITE_APP_VERSION=1.0.0
VITE_ENV=production
```

## 📊 MongoDB Configuration

### Connection String
```
mongodb+srv://bidtounsi_user:BidTounsi2024Secure@bidtounsi.mongodb.net/bidtounsi
```

### Collections
- `users` - Utilisateurs (Buyers, Sellers, Admins)
- `vehicles` - Annonces de véhicules
- `adminkeys` - Clés d'administration
- `messages` - Messages de contact

## 🔐 Credentials

### Admin Access
```
Email: admin@bidtounsi.tn
Admin Key: BIDTOUNSI_ADMIN_KEY_2024_SECURE_12345
```

### Database Access
```
Username: bidtounsi_user
Password: BidTounsi2024Secure
Host: bidtounsi.mongodb.net
Database: bidtounsi
```

### Email Service
```
Email: ayarisouhi@gmail.com
App Password: (App password from Gmail)
```

## 🚀 Deployment Checklist

- [x] Frontend deployed on Vercel
- [x] Backend deployed on Vercel
- [x] MongoDB connected
- [x] Environment variables configured
- [x] CORS configured
- [x] SSL/HTTPS enabled
- [x] Auto-deploy on git push enabled

## 🧪 Test Endpoints

```bash
# Health Check
GET https://bidtounsi-m9aafszi1-*.vercel.app/api/health

# Register
POST https://bidtounsi-m9aafszi1-*.vercel.app/api/auth/register
Body: { "email": "test@test.com", "password": "123456" }

# Login
POST https://bidtounsi-m9aafszi1-*.vercel.app/api/auth/login
Body: { "email": "test@test.com", "password": "123456" }

# Get Vehicles
GET https://bidtounsi-m9aafszi1-*.vercel.app/api/vehicles
```

## 📞 Support

| Issue | Solution |
|-------|----------|
| API not responding | Check MongoDB connection |
| CORS errors | Verify FRONTEND_URL in .env |
| Email not sending | Check Gmail App Password |
| Login fails | Verify JWT_SECRET is same everywhere |

## 🔄 Updating Production

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Vercel auto-deploys
# Update .env on Vercel if needed: Settings > Environment Variables
```

---
**Last Updated:** 15 Décembre 2025
**Status:** ✅ Production Ready
