import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppLayout } from './components/AppLayout';
import { HomePage } from './components/HomePage';
import { ContactPage } from './components/ContactPage';
import { AboutPage } from './components/AboutPage';
import { LegalPage } from './components/LegalPage';
import { AdminAccess } from './components/AdminAccess';
import { RequestAdminKey } from './components/RequestAdminKey';
import { LoginPage } from './components/LoginPage';
import { RegisterAdmin } from './components/RegisterAdmin';
import { DashboardVendeur } from './components/DashboardVendeur';
import { DashboardAcheteur } from './components/DashboardAcheteur';
import { DashboardAdmin } from './components/DashboardAdmin';
import { PublishVehicle } from './components/PublishVehicle';
import { ProfilePage } from './components/ProfilePage';
import { initializeSeedData } from './utils/seedData';

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = '799432753242-nap9npfgfaiehreq1iu62gj57ka71idi.apps.googleusercontent.com';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  // Initialiser les données de démonstration au premier chargement
  useEffect(() => {
    initializeSeedData();
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'legal':
        return <LegalPage onNavigate={handleNavigate} />;
      case 'admin-access':
        return <AdminAccess onNavigate={handleNavigate} />;
      case 'request-admin-key':
        return <RequestAdminKey onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register-admin':
        return <RegisterAdmin onNavigate={handleNavigate} />;
      case 'dashboard':
        if (!isAuthenticated) {
          setCurrentPage('login');
          return <LoginPage onNavigate={handleNavigate} />;
        }
        if (user?.userType === 'admin') {
          return <DashboardAdmin onNavigate={handleNavigate} />;
        }
        return user?.userType === 'vendeur' 
          ? <DashboardVendeur onNavigate={handleNavigate} />
          : <DashboardAcheteur onNavigate={handleNavigate} />;
      case 'publish-vehicle':
        if (!isAuthenticated || user?.userType !== 'vendeur') {
          setCurrentPage('dashboard');
          if (user?.userType === 'admin') {
            return <DashboardAdmin onNavigate={handleNavigate} />;
          }
          return user?.userType === 'vendeur' 
            ? <DashboardVendeur onNavigate={handleNavigate} />
            : <DashboardAcheteur onNavigate={handleNavigate} />;
        }
        return <PublishVehicle onNavigate={handleNavigate} />;
      case 'profile':
        if (!isAuthenticated) {
          setCurrentPage('login');
          return <LoginPage onNavigate={handleNavigate} />;
        }
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Pages qui n'utilisent pas l'AppLayout
  const standalonePages = ['home', 'login', 'register-admin', 'contact', 'about', 'legal', 'admin-access', 'request-admin-key'];
  
  if (standalonePages.includes(currentPage)) {
    return renderPage();
  }

  // Pages avec layout
  return (
    <NotificationProvider>
      <AppLayout currentPage={currentPage} onNavigate={handleNavigate}>
        {renderPage()}
      </AppLayout>
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}