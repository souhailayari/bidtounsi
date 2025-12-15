/**
 * Utilitaire pour générer et gérer les clés administrateur
 */

import crypto from 'crypto';
import { AdminKey } from '../models/AdminKey';

/**
 * Génère une clé admin aléatoire et sécurisée
 * Format: BT-XXXXXXXX-XXXXXXXX-XXXXXXXX
 */
export function generateAdminKey(): string {
  const prefix = 'BT'; // BidTounsi
  const parts = [];
  
  for (let i = 0; i < 3; i++) {
    const randomBytes = crypto.randomBytes(4);
    const hex = randomBytes.toString('hex').toUpperCase();
    parts.push(hex);
  }
  
  return `${prefix}-${parts.join('-')}`;
}

/**
 * Crée et sauvegarde une clé admin en base de données
 */
export async function createAdminKey(
  adminId: string,
  email: string,
  name: string
): Promise<string | null> {
  try {
    const key = generateAdminKey();
    
    const adminKey = new AdminKey({
      key,
      adminId,
      email,
      name,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
    });
    
    await adminKey.save();
    console.log(`✓ Admin key created for ${email}: ${key}`);
    return key;
  } catch (error) {
    console.error('Error creating admin key:', error);
    return null;
  }
}

/**
 * Valide une clé admin
 */
export async function validateAdminKey(key: string): Promise<boolean> {
  try {
    const adminKey = await AdminKey.findOne({
      key,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });
    
    return !!adminKey;
  } catch (error) {
    console.error('Error validating admin key:', error);
    return false;
  }
}

/**
 * Marque une clé comme utilisée
 */
export async function useAdminKey(key: string): Promise<boolean> {
  try {
    const result = await AdminKey.findOneAndUpdate(
      { key, isUsed: false },
      { isUsed: true, usedAt: new Date() },
      { new: true }
    );
    
    return !!result;
  } catch (error) {
    console.error('Error using admin key:', error);
    return false;
  }
}

/**
 * Obtient la clé admin d'un administrateur
 */
export async function getAdminKeyByEmail(email: string): Promise<string | null> {
  try {
    const adminKey = await AdminKey.findOne({
      email: email.toLowerCase(),
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });
    
    return adminKey?.key || null;
  } catch (error) {
    console.error('Error getting admin key:', error);
    return null;
  }
}

/**
 * Supprime les clés expirées
 */
export async function cleanupExpiredKeys(): Promise<number> {
  try {
    const result = await AdminKey.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    
    if (result.deletedCount > 0) {
      console.log(`✓ Cleaned up ${result.deletedCount} expired admin keys`);
    }
    
    return result.deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired keys:', error);
    return 0;
  }
}

/**
 * Récupère l'historique des clés d'un admin
 */
export async function getAdminKeyHistory(adminId: string): Promise<any[]> {
  try {
    return await AdminKey.find({ adminId })
      .select('key createdAt expiresAt isUsed usedAt')
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting admin key history:', error);
    return [];
  }
}

export default {
  generateAdminKey,
  createAdminKey,
  validateAdminKey,
  useAdminKey,
  getAdminKeyByEmail,
  cleanupExpiredKeys,
  getAdminKeyHistory,
};
