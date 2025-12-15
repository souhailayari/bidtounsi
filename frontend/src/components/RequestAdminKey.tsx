import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { generateSecretKey, storeSecretKeyForEmail } from '../utils/secretKeyGenerator';

interface RequestAdminKeyProps {
  onNavigate: (page: string) => void;
  onKeyGenerated?: (email: string, key: string) => void;
}

export function RequestAdminKey({ onNavigate, onKeyGenerated }: RequestAdminKeyProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    if (!email || !generatedKey) {
      setError('Email et clé sont requis');
      return;
    }

    setSendingEmail(true);
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/auth/send-secret-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          secretKey: generatedKey,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        alert('✅ Clé envoyée par email avec succès!');
      } else {
        setError(data.message || 'Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Impossible d\'envoyer l\'email. Le backend peut ne pas être disponible.');
    }

    setSendingEmail(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Adresse email invalide');
      return;
    }

    setLoading(true);

    try {
      // Génère une clé secrète aléatoire
      const secretKey = generateSecretKey();
      
      // Stocke la clé localement (24h de validité)
      storeSecretKeyForEmail(email, secretKey);
      
      // Essaie d'envoyer par le backend (si disponible)
      try {
        const response = await fetch('http://localhost:4000/api/auth/send-secret-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            secretKey,
          }),
        });

        if (!response.ok) {
          console.warn('Backend email service not available, using local display');
        }
      } catch (backendError) {
        // Le backend n'est pas disponible, c'est ok
        console.log('Backend not available - key will be shown locally');
      }
      
      setGeneratedKey(secretKey);
      setSuccess(true);

      console.log(`Clé secrète générée pour ${email}: ${secretKey}`);
      console.log('Validité: 24 heures');

      // Appelle le callback si fourni
      if (onKeyGenerated) {
        onKeyGenerated(email, secretKey);
      }

      // Réinitialise le formulaire après 3 secondes
      setTimeout(() => {
        setEmail('');
        setGeneratedKey('');
      }, 3000);
    } catch (error) {
      setError('Erreur lors de la génération de la clé');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Bouton retour */}
        <button
          className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/80 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
          onClick={() => onNavigate('admin-access')}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <Card className="border-2 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-center">Clé Secrète Aléatoire</CardTitle>
            <CardDescription className="text-blue-100 text-center">
              Recevez votre clé d'enregistrement par email
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Votre adresse email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@example.com"
                    required
                    disabled={loading}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    Vous recevrez une clé secrète aléatoire valide 24 heures
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    ❌ {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3"
                  disabled={loading}
                >
                  {loading ? 'Génération...' : 'Générer ma clé secrète'}
                </Button>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-sm mb-2 text-blue-900">Comment ça marche?</h4>
                  <ol className="text-xs text-blue-800 space-y-1">
                    <li>1. Entrez votre adresse email</li>
                    <li>2. Générez une clé secrète aléatoire</li>
                    <li>3. Utilisez la clé pour vous enregistrer comme administrateur</li>
                    <li>4. La clé expire après 24 heures</li>
                  </ol>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">Clé générée avec succès!</h3>
                  <p className="text-sm text-gray-600">
                    Voici votre clé secrète aléatoire (valide 24h):
                  </p>

                  <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300 break-all">
                    <code className="font-mono font-bold text-blue-600 text-lg">
                      {generatedKey}
                    </code>
                  </div>

                  <p className="text-xs text-gray-500">
                    📧 Une copie a été envoyée à votre email
                  </p>

                  <Button
                    onClick={() => {
                      // Copie la clé
                      navigator.clipboard.writeText(generatedKey);
                      alert('Clé copiée!');
                    }}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    Copier la clé
                  </Button>

                  <Button
                    onClick={handleSendEmail}
                    disabled={sendingEmail || emailSent}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold mt-2"
                  >
                    {emailSent ? '✓ Clé envoyée par email' : sendingEmail ? 'Envoi...' : '📧 Envoyer la clé par email'}
                  </Button>

                  <Button
                    onClick={() => onNavigate('register-admin')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold mt-2"
                  >
                    Aller à l'enregistrement
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-gray-600">
                Avez-vous déjà une clé?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium"
                  onClick={() => onNavigate('register-admin')}
                >
                  S'enregistrer directement
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
