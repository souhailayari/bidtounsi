# 📦 Guide d'Installation - BidTounsi

## 🚀 Installation Rapide

### Prérequis
- **Node.js** : Version 18.x ou supérieure
- **npm** : Version 9.x ou supérieure

### Étapes d'Installation

#### 1️⃣ Cloner ou Ouvrir le Projet
```bash
cd "C:\Users\Ayari\Downloads\AutoBid Application Design"
```

#### 2️⃣ Nettoyer les Anciennes Dépendances (Si nécessaire)
```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Ou sur Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json
```

#### 3️⃣ Installer les Dépendances
```bash
npm install --legacy-peer-deps
```

> **Note**: L'option `--legacy-peer-deps` permet d'éviter les conflits de versions entre les dépendances.

#### 4️⃣ Lancer le Projet
```bash
npm run dev
```

Le projet sera accessible sur: **http://localhost:3000**

---

## 🔧 Résolution des Problèmes

### Problème: Erreur `ERESOLVE unable to resolve dependency tree`

**Solution 1** (Recommandé):
```bash
npm install --legacy-peer-deps
```

**Solution 2**:
```bash
npm install --force
```

**Solution 3** (Clean install):
```bash
# Supprimer tout
rm -rf node_modules package-lock.json

# Réinstaller
npm install --legacy-peer-deps
```

### Problème: Conflit entre React 18 et React Three Fiber

**Solution**: Le `package.json` a été mis à jour pour utiliser:
- `@react-three/fiber@^8.17.10` (compatible React 18)
- `@react-three/drei@^9.114.3` (compatible React 18)

Ces versions sont stables et compatibles avec React 18.3.1.

### Problème: Erreur de compilation TypeScript

**Solution**:
```bash
npm install --save-dev @types/three @types/node @types/react @types/react-dom
```

---

## 📋 Versions des Dépendances Principales

| Package | Version | Raison |
|---------|---------|--------|
| React | 18.3.1 | Stable et largement supporté |
| React Three Fiber | 8.17.10 | Compatible React 18 |
| React Three Drei | 9.114.3 | Compatible React 18 |
| Three.js | 0.169.0 | Dernière version stable |
| Next.js | 14.2.0 | Framework principal |
| Motion | 11.15.0 | Animations (ex Framer Motion) |
| Tailwind CSS | 4.0.0 | Styling moderne |

---

## 🎯 Commandes Utiles

### Développement
```bash
npm run dev          # Lancer en mode développement
npm run build        # Build pour production
npm run start        # Lancer la version production
npm run lint         # Vérifier le code
```

### Nettoyage
```bash
# Nettoyer node_modules et cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 🐛 Problèmes Connus

### 1. Warning Three.js Multiple Instances
**Status**: ✅ Résolu
- Import optimisé dans `Car3DScene.tsx`
- Utilisation de types uniquement: `import type { Group } from 'three'`

### 2. Expo Dependencies
**Status**: ⚠️ Optionnel
- Expo est une dépendance peer optionnelle de React Three Fiber
- Pas nécessaire pour ce projet (web uniquement)
- Ignoré avec `--legacy-peer-deps`

### 3. React Hook Form Version
**Status**: ✅ Géré
- Version spécifique importée: `react-hook-form@7.55.0`
- Utilisation dans les formulaires

---

## 📦 Structure après Installation

```
node_modules/           ← Toutes les dépendances (créé après npm install)
├── react/
├── @react-three/
│   ├── fiber/
│   └── drei/
├── three/
├── motion/
└── ... (autres dépendances)

public/
├── models/            ← Vos modèles 3D .glb
└── ...

components/            ← Composants React
utils/                 ← Utilitaires
styles/               ← CSS
```

---

## ✅ Vérification de l'Installation

Après `npm install`, vérifiez que:

1. **node_modules existe**:
   ```bash
   ls node_modules
   ```

2. **Pas d'erreurs critiques**:
   - Les warnings sont normaux
   - Seules les erreurs critiques sont bloquantes

3. **Lancement réussi**:
   ```bash
   npm run dev
   ```
   Devrait afficher:
   ```
   ✓ Ready in 3.2s
   ○ Local: http://localhost:3000
   ```

---

## 🔄 Mise à Jour des Dépendances (Future)

Pour mettre à jour les dépendances dans le futur:

```bash
# Vérifier les mises à jour disponibles
npm outdated

# Mettre à jour une dépendance spécifique
npm update package-name --legacy-peer-deps

# Mettre à jour toutes les dépendances mineures
npm update --legacy-peer-deps
```

---

## 🆘 Support

En cas de problème persistant:

1. **Vérifier Node.js**:
   ```bash
   node --version   # Devrait être >= 18.x
   npm --version    # Devrait être >= 9.x
   ```

2. **Clean install complet**:
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install --legacy-peer-deps
   ```

3. **Vérifier le package.json**:
   - Assurez-vous que le `package.json` contient les bonnes versions

---

## 🎉 Installation Réussie!

Si vous voyez ce message après `npm run dev`:
```
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

🎊 **Félicitations!** Votre projet BidTounsi est prêt!

Vous pouvez maintenant:
- ✅ Ajouter vos modèles 3D dans `/public/models/`
- ✅ Personnaliser les composants
- ✅ Tester l'authentification
- ✅ Créer des annonces de véhicules

---

## 📚 Prochaines Étapes

1. **Ajouter un modèle 3D**:
   - Voir: `/public/models/INSTRUCTIONS.md`

2. **Configurer l'application**:
   - Voir: `/utils/3dModels.ts`

3. **Comprendre la structure**:
   - Voir: `/PROJECT_STRUCTURE.md`

Bon développement! 🚗✨
