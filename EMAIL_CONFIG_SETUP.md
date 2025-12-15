# 📧 Configuration Email pour BidTounsi

## Pour fonctionner complètement, il faut activer les emails

### Option 1: Gmail avec App Password (Recommandé)

#### Étapes:
1. Aller sur: https://myaccount.google.com/apppasswords
2. Sélectionner "Mail" et "Windows Computer"
3. Google génère un mot de passe de 16 caractères
4. Copier ce mot de passe
5. Mettre à jour `backend/.env`:

```env
EMAIL_USER=votre_email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

6. Relancer le backend:
```bash
cd backend
npm run dev
```

### Option 2: Gmail classique (Moins sécurisé)

1. Aller sur: https://myaccount.google.com/security
2. Activer "Accès des applis peu sécurisées"
3. Utiliser votre mot de passe Gmail directement

```env
EMAIL_USER=votre_email@gmail.com
GMAIL_APP_PASSWORD=votre_password_gmail
```

### Option 3: Autre fournisseur email

Modifier `backend/src/services/emailService.ts`:

```typescript
// Exemple avec Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Exemple avec Outlook
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Exemple avec Yahoo
const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});
```

### Option 4: Désactiver les emails (Dev)

Si vous n'en avez pas besoin localement, modifier `backend/src/services/emailService.ts`:

```typescript
export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    console.log(`📧 Email would be sent to: ${to}`);
    console.log(`Subject: ${subject}`);
    // return Promise.resolve(); // Décommentez pour désactiver
    
    // ... reste du code
  } catch (error) {
    console.error('❌ Email error:', error);
    // Ne pas interrompre l'application si email échoue
    return Promise.resolve();
  }
};
```

### Tester la Configuration

```bash
# Vérifier que le backend démarre sans erreur email
cd backend
npm run dev

# Vous devriez voir:
# ✅ Email service initialized (ou un message similaire)
```

### Troubleshooting

#### "Invalid login: 535-5.7.8 Username and Password not accepted"
- Vérifier le mot de passe (App Password de Gmail)
- Vérifier que l'email est correct
- Réessayer de générer un nouvel App Password

#### "SMTP Error: connect ENOTFOUND"
- Vérifier la connexion internet
- Vérifier le firewall

#### "Cannot send mail - No recipients defined"
- Vérifier que les emails destinataires sont valides

## 🔗 Liens Utiles

- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [Nodemailer Guide](https://nodemailer.com/)
- [Gmail SMTP Settings](https://support.google.com/a/answer/176600)
