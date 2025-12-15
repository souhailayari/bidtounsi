/**
 * Configuration centralisée des modèles 3D
 * 
 * Pour changer le modèle utilisé:
 * 1. Placez votre fichier .glb dans /public/models/
 * 2. Changez le nom dans DEFAULT_CAR_MODEL ci-dessous
 * 3. Le modèle sera automatiquement chargé partout
 */

// ========================================
// 🚗 CONFIGURATION DES MODÈLES 3D
// ========================================

/**
 * Nom du fichier .glb principal pour la voiture
 * 
 * Exemples:
 * - "car-default.glb"     → Voiture par défaut
 * - "sedan.glb"           → Berline
 * - "suv.glb"             → SUV
 * - "sports-car.glb"      → Voiture de sport
 * - "truck.glb"           → Camion
 * - "bmw_e34_stance_style.glb" → BMW E34 Stance Style
 * 
 * ⚠️ IMPORTANT: Le fichier doit être dans /public/models/
 */
export const DEFAULT_CAR_MODEL = "bmw_e34_stance_style.glb";

/**
 * Modèles disponibles (pour future expansion)
 */
export const CAR_MODELS = {
  DEFAULT: "car-default.glb",
  SEDAN: "sedan.glb",
  SUV: "suv.glb",
  SPORTS: "sports-car.glb",
  TRUCK: "truck.glb",
  VAN: "van.glb",
  BMW_E34: "bmw_e34_stance_style.glb",
} as const;

/**
 * Types de véhicules avec leurs modèles
 */
export const VEHICLE_TYPE_MODELS: Record<string, string> = {
  "Berline": CAR_MODELS.SEDAN,
  "SUV": CAR_MODELS.SUV,
  "Sportive": CAR_MODELS.SPORTS,
  "Camionnette": CAR_MODELS.TRUCK,
  "Utilitaire": CAR_MODELS.VAN,
  "BMW": CAR_MODELS.BMW_E34,
  "BMW E34": CAR_MODELS.BMW_E34,
  "default": CAR_MODELS.DEFAULT,
};

/**
 * Récupère le chemin complet du modèle
 */
export function getModelPath(modelName?: string): string | undefined {
  if (!modelName) {
    // Essayer de charger le modèle par défaut
    return `/models/${DEFAULT_CAR_MODEL}`;
  }
  
  return `/models/${modelName}`;
}

/**
 * Récupère le modèle selon le type de véhicule
 */
export function getModelByVehicleType(vehicleType?: string): string | undefined {
  if (!vehicleType) {
    return getModelPath(DEFAULT_CAR_MODEL);
  }
  
  const modelName = VEHICLE_TYPE_MODELS[vehicleType] || VEHICLE_TYPE_MODELS["default"];
  return getModelPath(modelName);
}

/**
 * Vérifie si un modèle existe (à utiliser avec try/catch)
 */
export function checkModelExists(modelPath: string): Promise<boolean> {
  return fetch(modelPath, { method: 'HEAD' })
    .then(response => response.ok)
    .catch(() => false);
}

// ========================================
// 🎨 CONFIGURATION DES COULEURS 3D
// ========================================

/**
 * Couleurs par défaut pour les voitures 3D
 */
export const CAR_COLORS = {
  BLUE: "#1D4ED8",
  RED: "#DC2626",
  BLACK: "#1F2937",
  WHITE: "#F9FAFB",
  SILVER: "#9CA3AF",
  GREEN: "#059669",
  YELLOW: "#F59E0B",
  PURPLE: "#7C3AED",
} as const;

export const DEFAULT_CAR_COLOR = CAR_COLORS.BLUE;

// ========================================
// 📝 EXEMPLES D'UTILISATION
// ========================================

/*

EXEMPLE 1: Utilisation simple dans un composant
---------------------------------------------
import { getModelPath } from '@/utils/3dModels';

<Car3DScene modelPath={getModelPath()} />


EXEMPLE 2: Utilisation avec type de véhicule
---------------------------------------------
import { getModelByVehicleType } from '@/utils/3dModels';

const vehicleType = "SUV";
<Car3DScene modelPath={getModelByVehicleType(vehicleType)} />


EXEMPLE 3: Utilisation avec modèle spécifique
---------------------------------------------
import { getModelPath, CAR_MODELS } from '@/utils/3dModels';

<Car3DScene modelPath={getModelPath(CAR_MODELS.SPORTS)} />


EXEMPLE 4: Changer le modèle par défaut
---------------------------------------------
Dans ce fichier, changez:
export const DEFAULT_CAR_MODEL = "mon-nouveau-modele.glb";

*/
