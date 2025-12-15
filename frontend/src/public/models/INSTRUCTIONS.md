# 🚗 Comment Ajouter et Utiliser Votre Modèle 3D

## 📥 Étape 1: Télécharger un Modèle

### Sites Recommandés (Gratuits)

1. **Sketchfab** ⭐ (Meilleur choix)
   - Aller sur: https://sketchfab.com/3d-models?features=downloadable&category=cars-vehicles
   - Filtrer par "Downloadable" + "Free"
   - Chercher: "car", "sedan", "suv", "truck"
   - Télécharger en format **.glb** ou **.gltf**

2. **Poly Pizza**
   - Aller sur: https://poly.pizza/
   - Chercher: voitures, véhicules
   - Télécharger directement en .glb

3. **Free3D**
   - Aller sur: https://free3d.com/3d-models/car
   - Télécharger et convertir en .glb si nécessaire

### Convertir en .glb (si besoin)

Si votre modèle est en .obj, .fbx, .gltf:
- Aller sur: https://products.aspose.app/3d/conversion
- Uploader votre fichier
- Convertir en GLB
- Télécharger

---

## 📁 Étape 2: Ajouter le Fichier au Projet

### Option A: Utiliser le Modèle par Défaut

1. Renommer votre fichier téléchargé en: **`car-default.glb`**
2. Placer le fichier ici: `/public/models/car-default.glb`
3. ✅ C'est tout! Le modèle sera chargé automatiquement

### Option B: Utiliser un Nom Personnalisé

1. Placer votre fichier .glb ici: `/public/models/mon-modele.glb`
2. Ouvrir le fichier: `/utils/3dModels.ts`
3. Changer la ligne:
   ```typescript
   export const DEFAULT_CAR_MODEL = "car-default.glb";
   ```
   En:
   ```typescript
   export const DEFAULT_CAR_MODEL = "mon-modele.glb";
   ```
4. ✅ Le nouveau modèle sera utilisé partout!

---

## 🎨 Étape 3: Personnaliser (Optionnel)

### Changer la Couleur par Défaut

Dans `/utils/3dModels.ts`:
```typescript
export const DEFAULT_CAR_COLOR = CAR_COLORS.RED; // Au lieu de BLUE
```

### Ajouter Plusieurs Modèles

1. Placer plusieurs fichiers dans `/public/models/`:
   - `sedan.glb`
   - `suv.glb`
   - `sports-car.glb`

2. Dans `/utils/3dModels.ts`, ajouter:
   ```typescript
   export const CAR_MODELS = {
     DEFAULT: "car-default.glb",
     SEDAN: "sedan.glb",
     SUV: "suv.glb",
     SPORTS: "sports-car.glb", // ← NOUVEAU
   };
   ```

3. Utiliser dans un composant:
   ```typescript
   import { getModelPath, CAR_MODELS } from '@/utils/3dModels';
   
   <Car3DScene modelPath={getModelPath(CAR_MODELS.SPORTS)} />
   ```

---

## 🔍 Vérification

### Le modèle ne s'affiche pas?

1. **Vérifier le nom du fichier**
   - Le nom dans `/utils/3dModels.ts` doit correspondre exactement
   - Sensible à la casse: `Car.glb` ≠ `car.glb`

2. **Vérifier le format**
   - Format accepté: `.glb` ou `.gltf`
   - Format recommandé: `.glb` (plus léger)

3. **Vérifier la taille**
   - Maximum recommandé: 5 MB
   - Si trop lourd, optimiser sur: https://gltf.report/

4. **Regarder la console**
   - Ouvrir les DevTools (F12)
   - Regarder s'il y a des erreurs de chargement

### Le modèle est trop grand/petit?

Dans `/components/Car3DScene.tsx`, changer le `scale`:
```typescript
<primitive object={scene} scale={1.5} /> // ← Ajuster ce nombre
```
- Plus petit: `scale={1.0}`
- Plus grand: `scale={2.0}`

### Le modèle est trop sombre?

Dans `/components/Car3DScene.tsx`, augmenter l'intensité:
```typescript
<ambientLight intensity={0.6} /> // ← Augmenter (ex: 1.0)
<directionalLight intensity={1.5} /> // ← Augmenter (ex: 2.0)
```

---

## 📚 Exemples d'Utilisation

### Utilisation Simple (Partout)
```tsx
import { Car3DScene } from './components/Car3DScene';

// Utilise le modèle par défaut
<Car3DScene />
```

### Avec Modèle Spécifique
```tsx
import { Car3DScene } from './components/Car3DScene';
import { getModelPath } from './utils/3dModels';

// Modèle spécifique
<Car3DScene modelPath={getModelPath("suv.glb")} />
```

### Avec Couleur Personnalisée
```tsx
import { Car3DScene } from './components/Car3DScene';
import { CAR_COLORS } from './utils/3dModels';

// Voiture rouge
<Car3DScene color={CAR_COLORS.RED} />
```

---

## ✅ Structure Finale

```
public/
└── models/
    ├── README.md              ← Guide complet
    ├── INSTRUCTIONS.md        ← Ce fichier
    ├── car-default.glb        ← VOTRE MODÈLE ICI
    ├── sedan.glb              ← Optionnel
    ├── suv.glb                ← Optionnel
    └── sports-car.glb         ← Optionnel

utils/
└── 3dModels.ts                ← Configuration (changer le nom ici)

components/
└── Car3DScene.tsx             ← Composant 3D (ne pas modifier)
```

---

## 🎯 Résumé Rapide

1. **Télécharger** un modèle .glb depuis Sketchfab
2. **Renommer** en `car-default.glb`
3. **Placer** dans `/public/models/`
4. ✅ **Terminé!** Le modèle s'affiche automatiquement

---

## 💡 Besoin d'Aide?

- 🔗 Tutoriel Three.js: https://threejs.org/docs/
- 🔗 Tutoriel GLTF: https://www.khronos.org/gltf/
- 🔗 Optimiser .glb: https://gltf.report/
- 🔗 Convertir en .glb: https://products.aspose.app/3d/conversion
