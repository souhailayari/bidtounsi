import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingOrbs, Grid3D } from "./AnimatedBackground";
import { motion } from "motion/react";
import { LogIn, UserPlus, Shield, Zap, AlertCircle, Users } from "lucide-react";

interface AdminAccessProps {
  onNavigate: (page: string) => void;
}

export function AdminAccess({ onNavigate }: AdminAccessProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Arrière-plans 3D animés */}
      <FloatingOrbs />
      <Grid3D />
      
      <Header onNavigate={onNavigate} />
      <main className="relative z-10 pt-20">
        <AdminAccessContent onNavigate={onNavigate} />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function AdminAccessContent({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-blue-500/20 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Espace Sécurisé
            </span>
          </motion.div>

          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Accès <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Administration
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Connectez-vous ou créez un compte administrateur pour gérer la plateforme
          </motion.p>
        </motion.div>

        {/* Options d'accès */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Connexion Admin */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white border-2 border-blue-200 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <LogIn className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Admin Existant</h3>
                <p className="text-sm text-gray-600">Connexion à votre compte</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Vous disposez déjà d'un compte administrateur? Connectez-vous pour accéder au tableau de bord.
            </p>

            <button
              onClick={() => onNavigate('login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Se Connecter
            </button>
          </motion.div>

          {/* Création Admin */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white border-2 border-purple-200 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Nouvel Admin</h3>
                <p className="text-sm text-gray-600">Créer un compte administrateur</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Vous souhaitez créer un nouveau compte administrateur? Demandez une clé secrète aléatoire pour vous enregistrer.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => onNavigate('request-admin-key')}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Demander une Clé
              </button>
              
              <button
                onClick={() => onNavigate('register-admin')}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                S'Enregistrer
              </button>
            </div>
          </motion.div>
        </div>

        {/* Fonctionnalités Admin */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Fonctionnalités de l'Administration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Gestion des Utilisateurs",
                description: "Créer, modifier et gérer les comptes utilisateurs"
              },
              {
                icon: Shield,
                title: "Modération",
                description: "Approuver et modérer les annonces de véhicules"
              },
              {
                icon: Zap,
                title: "Statistiques",
                description: "Consulter les statistiques et rapports de la plateforme"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Information Sécurité */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-8 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-200"
        >
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sécurité de l'Administration</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• L'accès administrateur est réservé aux utilisateurs autorisés uniquement</li>
                <li>• Utilisez un mot de passe fort et unique pour votre compte</li>
                <li>• Ne partagez jamais vos identifiants d'administration avec d'autres</li>
                <li>• La création de nouveaux comptes administrateur nécessite une clé secrète</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
