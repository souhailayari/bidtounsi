import { Router, Request, Response } from 'express';
import { sendContactEmail } from '../services/emailService';

const router = Router();

// Interface pour les données du formulaire de contact
interface ContactFormRequest extends Request {
  body: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  };
}

/**
 * POST /api/contact
 * Envoie un message de contact
 */
router.post('/', async (req: ContactFormRequest, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation des données
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Les champs nom, email, sujet et message sont obligatoires',
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Adresse email invalide',
      });
    }

    // Validation de la longueur du message
    if (message.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Le message ne doit pas dépasser 5000 caractères',
      });
    }

    // Envoie l'email
    const emailSent = await sendContactEmail(
      name,
      email,
      phone,
      subject,
      message
    );

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'envoi du message. Veuillez réessayer plus tard.',
      });
    }

    // Enregistre le message en base de données (optionnel)
    try {
      const contactMessage = {
        id: `contact_${Date.now()}`,
        name,
        email,
        phone: phone || null,
        subject,
        message,
        createdAt: new Date().toISOString(),
        status: 'pending', // pending, read, replied
      };

      // Sauvegarde dans localStorage/fichier si nécessaire
      console.log('Contact message saved:', contactMessage);
    } catch (dbError) {
      console.error('Error saving contact message to database:', dbError);
      // Ne pas bloquer si la sauvegarde échoue
    }

    res.status(200).json({
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous recontacterons bientôt.',
    });
  } catch (error) {
    console.error('Error in contact route:', error);
    res.status(500).json({
      success: false,
      error: 'Une erreur interne s\'est produite',
    });
  }
});

/**
 * GET /api/contact/test
 * Teste la connexion au service d'email
 */
router.get('/test', async (req: Request, res: Response) => {
  try {
    // Teste l'envoi d'un email de test
    const testResult = await sendContactEmail(
      'Test User',
      'test@example.com',
      undefined,
      'Message de test',
      'Ceci est un message de test du système de contact BidTounsi'
    );

    if (testResult) {
      res.status(200).json({
        success: true,
        message: 'Email de test envoyé avec succès',
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'envoi du test',
      });
    }
  } catch (error) {
    console.error('Error in contact test route:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du test',
    });
  }
});

export default router;
