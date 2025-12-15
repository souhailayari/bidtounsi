import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingOrbs, Grid3D } from "./AnimatedBackground";
import { motion } from "motion/react";
import { CheckCircle2, Shield, Zap, TrendingUp } from "lucide-react";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Arrière-plans 3D animés */}
      <FloatingOrbs />
      <Grid3D />
      
      <Header onNavigate={onNavigate} />
      <main className="relative z-10 pt-20">
        <AboutContent />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function AboutContent() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            À Propos de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              BidTounsi
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Une plateforme numérique pour la vente et l'achat de véhicules en Tunisie
          </motion.p>
        </motion.div>

        {/* Qu'est-ce que BidTounsi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 p-8 md:p-12 rounded-2xl bg-white border-2 border-blue-100"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Qu'est-ce que BidTounsi?</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            BidTounsi est une plateforme numérique qui facilite la vente et l'achat de véhicules en Tunisie. 
            Notre objectif est de créer un marché transparent et accessible pour tous.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Nous offrons des outils simples pour que les vendeurs publient leurs véhicules et 
            les acheteurs trouvent facilement ce qu'ils cherchent.
          </p>
        </motion.div>

        {/* Nos caractéristiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Nos Caractéristiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: CheckCircle2,
                title: "Simple",
                description: "Interface facile à utiliser pour tous"
              },
              {
                icon: Shield,
                title: "Sécurisé",
                description: "Transactions protégées et vérifiées"
              },
              {
                icon: Zap,
                title: "Rapide",
                description: "Trouvez et vendez rapidement"
              },
              {
                icon: TrendingUp,
                title: "Transparent",
                description: "Informations claires et complètes"
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
                  className="p-6 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all text-center"
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

        {/* Comment ça marche */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Comment ça marche?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Créer un compte",
                description: "Inscrivez-vous gratuitement avec votre email"
              },
              {
                step: "2",
                title: "Publier ou Chercher",
                description: "Vendez votre véhicule ou trouvez celui que vous cherchez"
              },
              {
                step: "3",
                title: "Conclure la transaction",
                description: "Communiquez directement avec les autres utilisateurs"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-2xl bg-white border-2 border-blue-100 text-center"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 mt-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contactez-nous */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Des Questions?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Notre équipe est prête à vous aider. N'hésitez pas à nous contacter pour toute question.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
            Nous Contacter
          </button>
        </motion.div>
      </div>
    </section>
  );
}
