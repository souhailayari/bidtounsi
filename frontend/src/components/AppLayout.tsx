import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { NotificationCenter } from './NotificationCenter';
import { ProfileDropdown } from './ProfileDropdown';
import { Car, Settings, User } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function AppLayout({ children, currentPage, onNavigate }: AppLayoutProps) {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const getNavigationItems = () => {
    // Pas de navigation dans la sidebar pour tous les types d'utilisateurs
    // La navigation se fait uniquement via le dropdown du profil
    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo et nom de la plateforme */}
            <div 
              className={`flex items-center space-x-2 sm:space-x-3 ${user ? '' : 'cursor-pointer'}`} 
              onClick={user ? undefined : () => onNavigate('home')}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">BidTounsi</h1>
                <p className="text-xs sm:text-sm text-gray-600">Vente & Achat de véhicules professionnels</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-base font-bold text-gray-900">BidTounsi</h1>
              </div>
            </div>

            {/* Navigation et boutons */}
            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  {/* Navigation pour utilisateurs connectés (sauf admin) */}
                  {navigationItems.length > 0 && (
                    <nav className="hidden md:flex space-x-2 lg:space-x-6">
                      {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <button
                            key={item.key}
                            onClick={() => onNavigate(item.key)}
                            className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                              currentPage === item.key
                                ? 'bg-primary text-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                            <span className="hidden lg:inline">{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  )}

                  {/* Centre de notifications */}
                  <NotificationCenter />

                  {/* Menu utilisateur avec dropdown premium */}
                  <ProfileDropdown 
                    user={user}
                    onNavigate={onNavigate}
                    onLogout={handleLogout}
                  />
                </>
              ) : (
                <>
                  {/* Boutons pour utilisateurs non connectés */}
                  <Button variant="outline" onClick={() => onNavigate('login')}>
                    Se connecter
                  </Button>
                  <Button onClick={() => onNavigate('register')}>
                    Créer un compte
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Navigation mobile pour utilisateurs connectés (sauf admin) */}
          {user && navigationItems.length > 0 && (
            <div className="md:hidden border-t border-gray-200 pt-2 pb-2">
              <nav className="flex space-x-4 overflow-x-auto">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => onNavigate(item.key)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                        currentPage === item.key
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}