# 🔧 Guide de Solution et Troubleshooting - BidTounsi

## ✅ Pour que le projet marche correctement

### 1. **Prérequis Obligatoires**
- ✅ Node.js >= 18
- ✅ npm >= 9
- ✅ Docker Desktop (pour MongoDB et déploiement)
- ✅ Git

### 2. **Installation Initiale**

```bash
# Cloner le projet
git clone https://github.com/souhailayari/bidtounsi.git
cd bidtounsi

# Installer les dépendances
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 3. **Démarrage en Développement (Local)**

#### Option A: Sans Docker (Plus rapide)

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Accès:**
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

#### Option B: Avec Docker (Production-like)

```bash
# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

**Accès:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### 4. **Configuration Requise**

#### Backend `.env`
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/bidtounsi
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend (Vite)
- Créer `frontend/.env.local`:
```
VITE_API_URL=http://localhost:4000
```

### 5. **Problèmes Courants et Solutions**

#### ❌ Erreur: "MongoDB connection failed"
**Solution:**
```bash
# Vérifier que MongoDB tourne
docker ps | grep mongodb

# Si pas de MongoDB, démarrer avec Docker
docker-compose up -d mongodb

# Ou installer MongoDB localement
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# Mac: brew install mongodb-community
# Linux: sudo apt install mongodb
```

#### ❌ Erreur: "Port 3000/4000 already in use"
**Solution:**
```bash
# Trouver le processus
netstat -ano | findstr :3000  # Windows
# ou
lsof -i :3000  # Mac/Linux

# Tuer le processus
taskkill /PID <PID> /F  # Windows
# ou
kill -9 <PID>  # Mac/Linux

# Ou utiliser des ports différents
PORT=4001 npm run dev  # Backend
VITE_API_URL=http://localhost:4001 npm run dev  # Frontend
```

#### ❌ Erreur: "Module not found"
**Solution:**
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Pour backend
cd backend && rm -rf node_modules && npm install && cd ..

# Pour frontend
cd frontend && rm -rf node_modules && npm install && cd ..
```

#### ❌ Erreur: "CORS error"
**Solution:**
- Vérifier `FRONTEND_URL` dans `backend/.env`
- Vérifier `VITE_API_URL` dans `frontend/.env.local`
- S'assurer que les ports correspondent

#### ❌ Erreur: "Email not sending"
**Solution:**
```bash
# Utiliser Google App Password (recommandé)
1. Aller sur myaccount.google.com/apppasswords
2. Générer un mot de passe d'application
3. Copier dans GMAIL_APP_PASSWORD dans .env
4. Redémarrer le backend
```

#### ❌ Erreur: "TypeScript compilation failed"
**Solution:**
```bash
# Réinstaller typescript
npm install -D typescript ts-node ts-node-dev

# Vérifier tsconfig.json
cat tsconfig.json

# Compiler manuellement
npx tsc --noEmit
```

### 6. **Vérification du Système**

```bash
# Vérifier les versions
node --version    # Doit être >= 18
npm --version     # Doit être >= 9
docker --version  # Si vous utilisez Docker

# Vérifier la connectivité
curl http://localhost:4000/api/health
curl http://localhost:5173

# Vérifier MongoDB
mongosh "mongodb://localhost:27017/bidtounsi"
```

### 7. **Build pour Production**

```bash
# Frontend uniquement (Vercel)
cd frontend
npm run build
# Output: frontend/build/

# Full stack build
npm run build:frontend
npm run build:backend

# Déployer sur Vercel
vercel --prod
```

### 8. **Logs et Debugging**

```bash
# Voir tous les logs
docker-compose logs -f

# Logs du backend uniquement
docker-compose logs -f backend

# Logs du MongoDB
docker-compose logs -f mongodb

# Attacher un shell au backend
docker-compose exec backend sh

# Vérifier l'état des services
docker-compose ps
```

### 9. **Reset Complet**

```bash
# Arrêter tout
docker-compose down

# Supprimer les volumes (attention: supprime la DB!)
docker-compose down -v

# Nettoyer les conteneurs/images
docker system prune -a

# Réinstaller les dépendances
rm -rf backend/node_modules frontend/node_modules node_modules
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Redémarrer
docker-compose up -d
```

### 10. **Deployment Checklist**

- [ ] `.env` configuré correctement
- [ ] Tests locaux passent
- [ ] Build sans erreurs: `npm run build`
- [ ] GitHub repository à jour
- [ ] Variables d'environnement Vercel configurées
- [ ] MongoDB Atlas URL configurée
- [ ] CORS settings corrects
- [ ] Email configuration testée

---

## 📚 Ressources Utiles

- [MongoDB Local Setup](https://docs.mongodb.com/manual/installation/)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [Vercel Deployment](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💬 Besoin d'Aide?

Si vous rencontrez un problème:
1. Vérifier les logs: `docker-compose logs`
2. Vérifier `.env` files
3. Vérifier les ports
4. Réinstaller les dépendances
5. Faire un `docker-compose down && docker-compose up -d`

Bonne chance! 🚀
