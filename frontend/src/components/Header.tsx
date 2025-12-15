import { Button } from "./ui/button";
import { Logo } from "./Logo";

interface HeaderProps {
  onNavigate: (page: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et nom de la plateforme */}
          <div className="cursor-pointer" onClick={() => onNavigate('home')}>
            <Logo size="md" showText={true} />
          </div>
          
          {/* Boutons de connexion */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => onNavigate('login')}>
              Se connecter
            </Button>
            <Button 
              variant="outline" 
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={() => onNavigate('register-admin')}
            >
              Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}