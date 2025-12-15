# 📁 Dossier des Modèles 3D

## 🎯 Utilisation

Placez vos fichiers `.glb` ou `.gltf` ici pour les utiliser dans l'application BidTounsi.

## 🚀 DÉMARRAGE RAPIDE

1. **Télécharger** un modèle .glb depuis Sketchfab
2. **Renommer** en `car-default.glb`
3. **Placer** dans ce dossier (`/public/models/`)
4. ✅ C'est tout! Le modèle s'affiche automatiquement

📖 Pour les instructions détaillées, voir: **INSTRUCTIONS.md**

## 📥 Où trouver des modèles 3D gratuits ?

### Sites recommandés :

1. **Sketchfab** (Meilleur choix)
   - https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount&category=cars-vehicles
   - Filtrer par "Downloadable" et "Free"
   
2. **Poly Pizza**
   - https://poly.pizza/
   - Modèles simples et optimisés

3. **Free3D**
   - https://free3d.com/3d-models/car
   - Beaucoup de voitures gratuites

4. **CGTrader Free**
   - https://www.cgtrader.com/free-3d-models/car
   - Modèles de haute qualité

## 🚗 Modèles de voitures recommandés

### Pour BidTounsi, recherchez :
- **Berlines** : sedan, business car, luxury car
- **SUV** : suv, 4x4, crossover
- **Camionnettes** : pickup, van, delivery truck
- **Camions** : truck, lorry, commercial vehicle

## 📝 Instructions d'utilisation

1. **Télécharger** un modèle `.glb` ou `.gltf`
2. **Placer** le fichier dans ce dossier (`/public/models/`)
3. **Utiliser** dans le code :

```tsx
import { useGLTF } from '@react-three/drei';

function Car3DModel() {
  const { scene } = useGLTF('/models/votre-fichier.glb');
  return <primitive object={scene} scale={1} />;
}
```

## ⚙️ Optimisation

### Taille recommandée :
- **Maximum** : 5 MB
- **Idéal** : 1-2 MB

### Optimiser un modèle trop lourd :
1. Aller sur https://gltf.report/
2. Uploader votre fichier
3. Réduire les textures
4. Télécharger la version optimisée

## 📦 Modèles actuels

| Fichier | Description | Taille | Utilisation |
|---------|-------------|--------|-------------|
| `car-default.glb` | Voiture par défaut | - | HeroSection |
| `sedan.glb` | Berline | - | Catalogue |
| `suv.glb` | SUV | - | Catalogue |
| `truck.glb` | Camion | - | Catalogue |

## 🎨 Format recommandé

- **Format** : `.glb` (préféré) ou `.gltf`
- **Polygones** : < 50,000 pour performance
- **Textures** : 1024x1024 max
- **Animations** : Optionnel

## 🐛 Problèmes courants

### Le modèle est trop grand
```tsx
<primitive object={scene} scale={0.5} /> // Réduire l'échelle
```

### Le modèle est trop sombre
```tsx
<ambientLight intensity={1} /> // Augmenter la lumière
<directionalLight position={[10, 10, 5]} intensity={2} />
```

### Le modèle ne se charge pas
- Vérifier que le fichier est bien dans `/public/models/`
- Vérifier le nom du fichier (sensible à la casse)
- Vérifier que le fichier n'est pas corrompu

## 📚 Ressources

- [Three.js GLTF Loader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei useGLTF](https://github.com/pmndrs/drei#usegltf)
