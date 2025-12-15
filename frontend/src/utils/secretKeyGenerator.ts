/**
 * Utilitaires pour la génération de clés secrètes
 */

/**
 * Génère une clé secrète aléatoire
 * Format: BIDTOUNSI_XXXXXX_XXXXXX (24 caractères alphanumériques)
 */
export function generateSecretKey(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = 'BIDTOUNSI_';
  
  // Génère 12 caractères aléatoires
  for (let i = 0; i < 12; i++) {
    key += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Ajoute un tiret et 6 autres caractères
  key += '_';
  for (let i = 0; i < 6; i++) {
    key += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return key;
}

/**
 * Valide le format d'une clé secrète
 */
export function isValidSecretKeyFormat(key: string): boolean {
  const regex = /^BIDTOUNSI_[A-Z0-9]{12}_[A-Z0-9]{6}$/;
  return regex.test(key);
}

/**
 * Stocke la clé secrète temporairement (expire après 24h)
 */
export function storeSecretKeyForEmail(email: string, secretKey: string): void {
  const keys = JSON.parse(localStorage.getItem('bidtounsi_secret_keys') || '{}');
  
  keys[email] = {
    key: secretKey,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
  };
  
  localStorage.setItem('bidtounsi_secret_keys', JSON.stringify(keys));
}

/**
 * Récupère et valide la clé secrète pour un email
 */
export function getStoredSecretKey(email: string): string | null {
  const keys = JSON.parse(localStorage.getItem('bidtounsi_secret_keys') || '{}');
  
  if (!keys[email]) {
    return null;
  }
  
  const stored = keys[email];
  const now = new Date();
  const expiresAt = new Date(stored.expiresAt);
  
  // Vérifie si la clé a expiré
  if (now > expiresAt) {
    delete keys[email];
    localStorage.setItem('bidtounsi_secret_keys', JSON.stringify(keys));
    return null;
  }
  
  return stored.key;
}

/**
 * Supprime la clé secrète après utilisation
 */
export function deleteSecretKey(email: string): void {
  const keys = JSON.parse(localStorage.getItem('bidtounsi_secret_keys') || '{}');
  delete keys[email];
  localStorage.setItem('bidtounsi_secret_keys', JSON.stringify(keys));
}

export default {
  generateSecretKey,
  isValidSecretKeyFormat,
  storeSecretKeyForEmail,
  getStoredSecretKey,
  deleteSecretKey,
};
