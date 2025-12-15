/**
 * Route d'inscription des administrateurs
 * Génère et envoie une clé secrète par email
 */

import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { createAdminKey } from '../utils/adminKeyUtils';
import { sendAdminKeyEmail } from '../services/emailService';

const router = Router();

interface CreateAdminBody {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

/**
 * POST /api/admin/register
 * Crée un nouveau compte administrateur et envoie la clé secrète par email
 */
router.post('/register', async (req: Request<{}, {}, CreateAdminBody>, res: Response) => {
  try {
    const { email, password, name, phoneNumber } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, mot de passe et nom sont requis',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Le mot de passe doit contenir au moins 8 caractères',
      });
    }

    // Vérifier que l'email n'existe pas
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Un utilisateur avec cet email existe déjà',
      });
    }

    // Créer l'utilisateur admin
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      role: 'admin',
      phoneNumber,
    });

    await user.save();
    console.log(`✓ Admin user created: ${email}`);

    // Générer la clé secrète admin
    const adminKey = await createAdminKey(user._id.toString(), email, name);
    if (!adminKey) {
      console.error('Failed to generate admin key');
      return res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la génération de la clé secrète',
      });
    }

    // Envoyer la clé par email
    const emailSent = await sendAdminKeyEmail(email, adminKey, name);
    if (!emailSent) {
      console.warn('Warning: Admin key email could not be sent, but account was created');
    }

    res.status(201).json({
      status: 'success',
      message: emailSent
        ? 'Compte administrateur créé. Clé secrète envoyée par email.'
        : 'Compte créé (email non envoyé - vérifier les paramètres SMTP)',
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        adminKeyGenerated: true,
        emailSent,
      },
    });
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur du serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/admin/resend-key
 * Renvoie la clé admin par email (pour un admin existant)
 */
router.post('/resend-key', async (req: Request<{}, {}, { email: string }>, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email requis',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur administrateur non trouvé',
      });
    }

    // Créer une nouvelle clé
    const adminKey = await createAdminKey(user._id.toString(), user.email, user.name);
    if (!adminKey) {
      return res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la génération de la clé',
      });
    }

    // Envoyer par email
    const emailSent = await sendAdminKeyEmail(user.email, adminKey, user.name);

    res.json({
      status: 'success',
      message: emailSent
        ? 'Nouvelle clé envoyée par email'
        : 'Clé générée (email non envoyé)',
      data: { adminKeyGenerated: true, emailSent },
    });
  } catch (error: any) {
    console.error('Error resending admin key:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur du serveur',
    });
  }
});

/**
 * GET /api/admin/key-status/:email
 * Vérifie l'état de la clé admin d'un administrateur
 */
router.get('/key-status/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Administrateur non trouvé',
      });
    }

    // Récupérer la clé active
    const { AdminKey } = await import('../models/AdminKey');
    const activeKey = await AdminKey.findOne({
      adminId: user._id,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    res.json({
      status: 'success',
      data: {
        adminId: user._id,
        email: user.email,
        name: user.name,
        hasActiveKey: !!activeKey,
        keyExpiresAt: activeKey?.expiresAt || null,
      },
    });
  } catch (error: any) {
    console.error('Error checking admin key status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur du serveur',
    });
  }
});

export default router;
