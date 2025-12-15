# 📧 Configuration Email Gmail pour BidTounsi

## Erreur: Application-specific password required

Gmail ne permet pas l'authentification avec le mot de passe habituel pour les apps tierces.

## Solution: Créer un App Password

### Étape 1: Activer l'authentification 2FA

1. Allez à: https://myaccount.google.com/security
2. Dans la barre de gauche, cliquez **"2-Step Verification"**
3. Suivez les instructions pour activer

### Étape 2: Créer un App Password

1. Allez à: https://myaccount.google.com/apppasswords
2. **Select app:** Mail
3. **Select device:** Windows Computer (ou votre appareil)
4. Cliquez **"Generate"**
5. Google génère un mot de passe à **16 caractères**

### Étape 3: Mettre à jour le .env

Ouvrez `backend/.env` et remplacez:

```env
GMAIL_APP_PASSWORD=YOUR_16_CHAR_APP_PASSWORD_HERE
```

**Par le mot de passe généré par Google (16 caractères sans espaces)**

Exemple:
```env
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

Devient:
```env
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

### Étape 4: Redémarrer le backend

```bash
cd backend
npm start
```

## Format du Mot de Passe

Google fournit le mot de passe dans ce format:
```
abcd efgh ijkl mnop
```

**ENLEVEZ LES ESPACES:**
```
abcdefghijklmnop
```

## Vérification

Vous devriez voir:
```
✅ Email service is ready
```

Au lieu de:
```
❌ Email configuration error
```

## Variables d'Environnement Correctes

```env
# .env du backend
EMAIL_USER=ayarisouhi@gmail.com
GMAIL_APP_PASSWORD=YOUR_16_CHAR_PASSWORD

# IMPORTANT: NE PAS utiliser le mot de passe Gmail habituel
# NE PAS: benz@1812
# OUI: le mot de passe généré par Google (16 caractères)
```

## Troubleshooting

### Erreur: "Invalid login"
→ Vérifiez que le mot de passe a 16 caractères (sans espaces)

### Erreur: "Application-specific password required"
→ Créez un App Password depuis https://myaccount.google.com/apppasswords

### L'app password n'apparaît pas
→ Activez d'abord la 2FA (2-Step Verification)

### Les espaces dans le mot de passe
→ Supprimez-les. Google met des espaces pour lisibilité, mais le .env ne doit pas les avoir.

## Support

- Aide Google: https://support.google.com/mail/?p=InvalidSecondFactor
- Mon email: ayarisouhi@gmail.com
