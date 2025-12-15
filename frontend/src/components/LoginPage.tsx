import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Car, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    
    if (success) {
      onNavigate('dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
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
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Se connecter à BidTounsi</CardTitle>
          <CardDescription>
            Accédez à votre espace professionnel
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@entreprise.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  required
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

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => alert('Fonctionnalité à venir')}
            >
              Mot de passe oublié ?
            </button>
            
            <div className="text-sm text-gray-600">
              Besoin d'un compte administrateur ?{' '}
              <button
                type="button"
                className="text-red-600 hover:underline font-medium"
                onClick={() => onNavigate('register-admin')}
              >
                Créer un compte admin
              </button>
            </div>
          </div>

          {/* Comptes de démonstration */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Comptes de démonstration :</h4>
            <div className="text-xs space-y-1 text-gray-600">
              <div>Admin: admin@bidtounsi.com / admin123</div>
              <div>Vendeur: vendeur@demo.com / password123</div>
              <div>Acheteur: acheteur@demo.com / password123</div>
            </div>
            <div className="mt-2 text-xs text-red-600">
              Clé secrète admin: ADMIN_SECRET_2025
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}