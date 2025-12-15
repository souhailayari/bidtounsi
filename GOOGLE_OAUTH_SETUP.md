# 🔐 Configuration Google OAuth pour BidTounsi

## Erreur 401: invalid_client

Cette erreur signifie que **localhost n'est pas autorisé** dans Google Cloud Console.

## Solution

### Étape 1: Accéder à Google Cloud Console

1. Allez à: https://console.cloud.google.com
2. Sélectionnez le projet: **bidtounsi**
3. Allez à: **APIs & Services > Credentials**

### Étape 2: Configurer les URLs de redirection

1. Cliquez sur votre **OAuth 2.0 Client ID**
2. Allez à la section **"Authorized redirect URIs"**
3. Ajoutez ces URLs:
   ```
   http://localhost:5173
   http://localhost:3000
   http://127.0.0.1:5173
   http://127.0.0.1:3000
   ```
4. Cliquez **"Save"**

### Étape 3: Vérifier le fichier .env.local

Créez/mettez à jour `.env.local` dans le dossier frontend:
```env
VITE_GOOGLE_CLIENT_ID=799432753242-nap9npfgfaiehreq1iu62gj57ka71idi.apps.googleusercontent.com
VITE_API_URL=http://localhost:4000
```

### Étape 4: Redémarrer le serveur frontend

```bash
cd frontend
npm run dev
```

## URLs à Ajouter par Environnement

### Développement (localhost)
```
http://localhost:5173
http://localhost:3000
http://127.0.0.1:5173
http://127.0.0.1:3000
```

### Production (Google Cloud)
```
https://bidtounsi.appspot.com
https://www.bidtounsi.appspot.com
```

## Alternative: Mode Test sans OAuth

Si Google OAuth continue à poser problème, vous pouvez:

1. **Désactiver temporairement** le GoogleOAuthProvider
2. **Utiliser une authentification locale** pour les tests
3. **Activer OAuth** en production seulement

### Code pour tester localement:

```tsx
const isDevelopment = !import.meta.env.PROD;

export default function App() {
  if (isDevelopment && !import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
```

## Dépannage

### Erreur: "redirect_uri_mismatch"
→ Vérifiez que l'URL correspond exactement à celle dans Google Console

### Erreur: "invalid_client"
→ Le Client ID est incorrect ou pas autorisé pour localhost

### Le bouton Google ne s'affiche pas
→ Vérifiez que GoogleOAuthProvider enveloppe le composant

## Support

- Documentation Google: https://developers.google.com/identity/protocols/oauth2
- Console Cloud: https://console.cloud.google.com
- Email: ayarisouhi@gmail.com
