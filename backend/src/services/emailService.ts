/**
 * Service d'Email pour BidTounsi
 * Gère l'envoi d'emails (clés admin, confirmations, messages de contact)
 */

import nodemailer from 'nodemailer';

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'ayarisouhi@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || 'benz@1812',
  },
});

// Vérifier la connexion email au démarrage
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email service is ready');
  }
});

/**
 * Envoyer la clé secrète aléatoire pour l'enregistrement admin
 * IMPORTANT: Envoie TOUJOURS à l'email administrateur (pas à l'utilisateur)
 */
export async function sendSecretKeyEmail(
  email: string,
  secretKey: string
): Promise<boolean> {
  try {
    const adminEmail = process.env.EMAIL_USER || 'ayarisouhi@gmail.com';
    
    const mailOptions = {
      from: adminEmail,
      to: adminEmail, // Envoie TOUJOURS à l'admin, pas à l'email de l'utilisateur
      subject: `🔑 Nouvelle Clé Secrète BidTounsi pour ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔑 Clé Secrète Générée</h1>
            <p style="color: white; margin: 10px 0 0 0;">Nouvelle demande d'enregistrement admin</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Une nouvelle clé secrète a été générée.
            </p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #666; font-size: 12px; margin: 0 0 5px 0;"><strong>Email demandeur:</strong></p>
              <p style="color: #333; font-size: 14px; margin: 0; font-weight: bold;">${email}</p>
            </div>
            
            <div style="background: #fff; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #10b981; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">
                Clé Secrète Aléatoire (Valide 24h)
              </p>
              <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; word-break: break-all;">
                <code style="font-size: 18px; font-weight: bold; color: #10b981; font-family: 'Courier New', monospace;">
                  ${secretKey}
                </code>
              </div>
            </div>

            <div style="background: #fffacd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #856404; font-size: 13px; margin: 0;">
                <strong>Action requise:</strong> Communiquez cette clé à l'administrateur qui la demande.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 11px;">
              <p style="margin: 5px 0;">
                © 2025 BidTounsi - Marketplace Automobile Professionnelle
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Secret key email sent to admin:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending secret key email:', error);
    return false;
  }
}

/**
 * Envoyer la clé admin par email
 */
export async function sendAdminKeyEmail(
  email: string,
  adminKey: string,
  adminName: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: '🔑 Votre Clé Admin BidTounsi - Accès Sécurisé',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔑 BidTounsi Admin</h1>
            <p style="color: white; margin: 10px 0 0 0;">Bienvenue administrateur!</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">
              Bonjour <strong>${adminName}</strong>,
            </p>
            
            <p style="color: #333; font-size: 14px; margin-bottom: 20px;">
              Votre compte administrateur a été créé avec succès sur <strong>BidTounsi</strong>.
            </p>
            
            <div style="background: #fff; border: 2px solid #667eea; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #667eea; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">
                Votre Clé Admin Secrète
              </p>
              <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; word-break: break-all;">
                <code style="font-size: 18px; font-weight: bold; color: #333; font-family: 'Courier New', monospace;">
                  ${adminKey}
                </code>
              </div>
              <p style="color: #666; font-size: 12px; margin: 10px 0 0 0;">
                ⚠️ Conservez cette clé en sécurité. Elle ne sera jamais renvoyée.
              </p>
            </div>
            
            <div style="background: #fffacd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #856404; font-size: 13px; margin: 0;">
                <strong>✓ Utilisation:</strong> Utilisez cette clé pour les opérations administrateur sensibles et les configurations avancées.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 12px; margin-bottom: 10px;">
                <strong>Informations de Sécurité:</strong>
              </p>
              <ul style="color: #666; font-size: 12px; margin: 10px 0; padding-left: 20px;">
                <li>Ne partagez jamais votre clé admin</li>
                <li>Changez votre mot de passe régulièrement</li>
                <li>Utilisez une authentification forte</li>
                <li>Signalez tout accès suspect</li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                <strong>Accédez à votre compte:</strong><br>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="color: #667eea; text-decoration: none;">
                  ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login
                </a>
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 11px;">
              <p style="margin: 5px 0;">
                © 2025 BidTounsi - Marketplace Automobile Professionnelle
              </p>
              <p style="margin: 5px 0;">
                Cette email a été envoyée automatiquement. Ne répondez pas directement.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
BidTounsi - Clé Admin

Bonjour ${adminName},

Votre compte administrateur a été créé avec succès.

VOTRE CLÉ ADMIN SECRÈTE:
${adminKey}

⚠️ Conservez cette clé en sécurité. Elle ne sera jamais renvoyée.

INFORMATIONS DE SÉCURITÉ:
- Ne partagez jamais votre clé admin
- Changez votre mot de passe régulièrement
- Utilisez une authentification forte
- Signalez tout accès suspect

Accédez à votre compte:
${process.env.FRONTEND_URL || 'http://localhost:3000'}/login

© 2025 BidTounsi
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending admin key email:', error);
    return false;
  }
}

/**
 * Envoyer un email de confirmation
 */
export async function sendConfirmationEmail(
  email: string,
  name: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: '✅ Compte BidTounsi Créé avec Succès',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">✅ Compte Créé</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
            <p>Bienvenue sur <strong>BidTounsi</strong>, ${name}!</p>
            <p>Votre compte a été créé avec succès.</p>
            <p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Accéder à BidTounsi
              </a>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}

/**
 * Tester la connexion SMTP
 */
export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('✓ Email service is ready');
    return true;
  } catch (error) {
    console.error('✗ Email service error:', error);
    return false;
  }
}

/**
 * Envoyer un email de message de contact
 */
export async function sendContactEmail(
  name: string,
  email: string,
  phone: string | undefined,
  subject: string,
  message: string
): Promise<boolean> {
  try {
    const adminEmail = process.env.EMAIL_USER || 'ayarisouhi@gmail.com';
    
    // Email pour l'administrateur
    const adminMailOptions = {
      from: adminEmail,
      to: adminEmail,
      subject: `[BidTounsi] Nouveau message de contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nouveau Message de Contact</h2>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
            <p><strong>Sujet:</strong> ${subject}</p>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151;">Message:</h3>
            <p style="line-height: 1.6; color: #4b5563; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>Message envoyé via le formulaire de contact BidTounsi</p>
            <p>Date: ${new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      `,
      replyTo: email,
    };

    // Email de confirmation pour l'utilisateur
    const userMailOptions = {
      from: adminEmail,
      to: email,
      subject: 'BidTounsi - Confirmation de votre message',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Merci pour votre message!</h2>
          
          <p style="line-height: 1.6; color: #4b5563;">
            Bonjour ${name},<br><br>
            Nous avons reçu votre message et le traiterons dans les plus brefs délais.
            Notre équipe vous contactera bientôt.
          </p>

          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Résumé de votre message:</strong></p>
            <p><strong>Sujet:</strong> ${subject}</p>
          </div>

          <div style="background-color: #dbeafe; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px; margin: 20px 0;">
            <p style="color: #1e40af;">
              <strong>Besoin d'une réponse urgente?</strong><br>
              N'hésitez pas à nous appeler au +216 71 123 456
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>À bientôt sur BidTounsi!</p>
            <p>L'équipe BidTounsi</p>
          </div>
        </div>
      `,
    };

    // Envoie les deux emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);
    
    console.log('Contact emails sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
}

export default transporter;
