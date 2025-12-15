import { Car, Facebook, Twitter, Linkedin } from "lucide-react";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">BidTounsi</h3>
                <p className="text-gray-400 text-sm">Vente & Achat de véhicules professionnels</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md">
              La plateforme digitale qui révolutionne le marché des véhicules professionnels 
              avec un système d'enchères transparent et sécurisé.
            </p>
          </div>
          
          {/* Liens rapides */}
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => handleNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  À propos
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('legal')}
                  className="hover:text-white transition-colors"
                >
                  Mentions légales
                </button>
              </li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('admin-access'); }} className="hover:text-red-400 text-red-400 transition-colors">Administration</a></li>
            </ul>
          </div>
          
          {/* Réseaux sociaux */}
          <div>
            <h4 className="font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 BidTounsi. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}