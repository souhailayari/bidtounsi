import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { sendSecretKeyEmail } from '../services/emailService';

const router = Router();

interface RegisterBody {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'vendeur' | 'acheteur';
  phoneNumber?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// Register
router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  try {
    const { email, password, name, role, phoneNumber } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, mot de passe et nom sont requis'
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        status: 'error',
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    const user = new User({
      email,
      password,
      name,
      role: role || 'acheteur',
      phoneNumber
    });

    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'Utilisateur créé avec succès',
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Erreur du serveur'
    });
  }
});

// Login
router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email et mot de passe requis'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Identifiants invalides'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Identifiants invalides'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      status: 'success',
      message: 'Connexion réussie',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Erreur du serveur'
    });
  }
});

// Send Secret Key Email
router.post('/send-secret-key', async (req: Request, res: Response) => {
  try {
    const { email, secretKey } = req.body;

    if (!email || !secretKey) {
      return res.status(400).json({
        status: 'error',
        message: 'Email et clé secrète sont requis'
      });
    }

    // Valide le format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Adresse email invalide'
      });
    }

    // Envoie la clé par email
    const emailSent = await sendSecretKeyEmail(email, secretKey);

    if (emailSent) {
      return res.json({
        status: 'success',
        message: 'Clé secrète envoyée par email avec succès',
        data: {
          email,
          message: 'Vérifiez votre email pour la clé secrète'
        }
      });
    } else {
      return res.status(500).json({
        status: 'error',
        message: 'Impossible d\'envoyer l\'email. Veuillez réessayer.'
      });
    }
  } catch (err: any) {
    console.error('Send secret key error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Erreur du serveur'
    });
  }
});

export default router;
