import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Car, Eye, EyeOff, Shield } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { getStoredSecretKey, isValidSecretKeyFormat, deleteSecretKey, generateSecretKey, storeSecretKeyForEmail } from '../utils/secretKeyGenerator';

interface RegisterAdminProps {
  onNavigate: (page: string) => void;
}

export function RegisterAdmin({ onNavigate }: RegisterAdminProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    secretKey: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [adminVerified, setAdminVerified] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      setError('');

      // Décode le JWT de Google
      const decoded: any = jwtDecode(credentialResponse.credential);
      const googleEmail = decoded.email;

      const adminEmail = 'ayarisouhi@gmail.com';
      
      // Vérifie si c'est le bon email
      if (googleEmail.toLowerCase() !== adminEmail.toLowerCase()) {
        setError(`❌ Seul ${adminEmail} peut créer des comptes administrateur`);
        return;
      }

      // Vérification réussie avec Google!
      setAdminVerified(true);
      alert(`✅ Authentification Google réussie!\n\nEmail vérifié: ${googleEmail}\n\nVous pouvez maintenant créer un compte pour un autre administrateur.`);
      
    } catch (error) {
      setError('Erreur lors de la vérification Google');
      console.error(error);
    }
  };

  const handleGoogleError = () => {
    setError('❌ Erreur lors de la connexion Google');
  };

  const handleRequestSecretKey = async () => {
    if (!formData.email) {
      setError('Veuillez entrer votre email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Adresse email invalide');
      return;
    }

    setSendingEmail(true);
    setError('');

    try {
      // Génère une clé secrète aléatoire
      const secretKey = generateSecretKey();
      
      // Stocke la clé localement
      storeSecretKeyForEmail(formData.email, secretKey);
      
      // Envoie TOUJOURS par le backend à l'email admin
      try {
        const response = await fetch('http://localhost:4000/api/auth/send-secret-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            secretKey,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Email envoyé avec succès
          setFormData(prev => ({ ...prev, secretKey }));
          setEmailSent(true);
          alert('✅ Clé secrète envoyée à votre email administrateur!\n\nVérifiez votre boîte mail pour la clé.');
          
          setTimeout(() => {
            setEmailSent(false);
          }, 3000);
        } else {
          setError(data.message || 'Erreur lors de l\'envoi de l\'email');
        }
      } catch (backendError) {
        console.error('Backend error:', backendError);
        setError('Impossible de contacter le serveur. Assurez-vous que le backend est actif.');
      }
    } catch (error) {
      setError('Erreur lors de la génération de la clé');
      console.error(error);
    }

    setSendingEmail(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Vérification: Est-ce que vous êtes autorisé à créer ce compte?
    if (!adminVerified) {
      setError('❌ Vous devez vérifier votre identité avec le bouton 🔐 pour créer un compte administrateur');
      return;
    }

    // Valide la clé secrète - format aléatoire BIDTOUNSI_XXXXXX_XXXXXX
    if (!isValidSecretKeyFormat(formData.secretKey)) {
      setError('Clé secrète invalide. Veuillez vérifier le format.');
      return;
    }

    // Vérifie si la clé correspond à celle stockée pour cet email et si elle n'est pas expirée
    const storedKey = getStoredSecretKey(formData.email);
    if (storedKey !== formData.secretKey) {
      setError('Clé secrète invalide ou expirée. Veuillez en demander une nouvelle.');
      return;
    }

    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      // Vérifier si l'email existe déjà
      const users = JSON.parse(localStorage.getItem('bidtounsi_users') || '[]');
      const existingUser = users.find((u: any) => u.email === formData.email);
      
      if (existingUser) {
        setError('Cet email est déjà utilisé');
        setLoading(false);
        return;
      }

      // Créer le compte administrateur
      const newAdmin = {
        id: Date.now().toString(),
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: 'admin',
        createdAt: new Date().toISOString(),
      };

      // Sauvegarder dans localStorage
      users.push(newAdmin);
      localStorage.setItem('bidtounsi_users', JSON.stringify(users));
      
      // Supprime la clé après utilisation réussie
      deleteSecretKey(formData.email);
      
      alert('Compte administrateur créé avec succès !');
      onNavigate('login');
    } catch (error) {
      setError('Erreur lors de la création du compte');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Bouton retour avec logo */}
        <button
          className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/80 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm sm:text-base font-bold text-gray-900">BidTounsi</div>
            <div className="text-xs text-gray-600">Retour à l'accueil</div>
          </div>
        </button>

        <Card className="w-full">
          <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Créer un compte Administrateur</CardTitle>
          <CardDescription>
            Inscription réservée aux administrateurs BidTounsi
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Bouton de vérification Google Auth */}
          {!adminVerified && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-sm mb-3 text-blue-900">Étape 1: Vérifiez votre identité avec Google</h3>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
              <p className="text-xs text-blue-700 mt-3 text-center">
                🔒 Connectez-vous avec ayarisouhi@gmail.com
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secretKey">Clé secrète *</Label>
              <div className="flex gap-2">
                <Input
                  id="secretKey"
                  type="password"
                  value={formData.secretKey}
                  onChange={(e) => handleInputChange('secretKey', e.target.value)}
                  placeholder="Entrez la clé secrète"
                  required
                />
                <Button
                  type="button"
                  onClick={handleRequestSecretKey}
                  disabled={sendingEmail || emailSent}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold whitespace-nowrap"
                >
                  {emailSent ? '✓' : sendingEmail ? '...' : '📧'}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Cliquez sur 📧 pour générer une clé secrète aléatoire
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Nom de l'organisation</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="BidTounsi Administration"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email administrateur à créer</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="nouvel.admin@exemple.com"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Entrez l'email du nouvel administrateur à créer
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="01 00 00 00 00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Au moins 8 caractères"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmation du mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {adminVerified && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                ✅ Vous êtes vérifiés! Vous pouvez créer ce compte administrateur.
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700" 
              disabled={loading || !adminVerified}
            >
              {!adminVerified ? '🔒 Vérifiez-vous d\'abord' : (loading ? 'Création...' : 'Créer le compte administrateur')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <button
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={() => onNavigate('login')}
              >
                Se connecter
              </button>
            </p>
          </div>

          {/* Informations de sécurité */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-sm mb-2 text-yellow-800">Information de sécurité</h4>
            <p className="text-xs text-yellow-700">
              La création de comptes administrateur nécessite une clé secrète. 
              Seul l'administrateur autorisé peut créer de nouveaux comptes.
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}