import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingOrbs, Grid3D } from "./AnimatedBackground";
import { motion } from "motion/react";

interface LegalPageProps {
  onNavigate: (page: string) => void;
}

export function LegalPage({ onNavigate }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Arrière-plans 3D animés */}
      <FloatingOrbs />
      <Grid3D />
      
      <Header onNavigate={onNavigate} />
      <main className="relative z-10 pt-20">
        <LegalContent />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function LegalContent() {
  const sections = [
    {
      title: "1. Informations Légales",
      content: [
        "Nom: BidTounsi",
        "Type: Plateforme de commerce électronique",
        "Adresse: Tunis, Tunisie",
        "Email: ayarisouhi@gmail.com",
        "Téléphone: +216 71 123 456"
      ]
    },
    {
      title: "2. Conditions d'Utilisation",
      content: [
        "L'utilisation de la plateforme BidTounsi est gratuite et accessible à tous les résidents tunisiens majeurs.",
        "En créant un compte, vous acceptez de respecter toutes les lois et réglementations applicables.",
        "Vous vous engagez à ne pas publier de contenu illégal, offensant ou trompeur.",
        "BidTounsi se réserve le droit de suspendre ou supprimer tout compte violant ces conditions."
      ]
    },
    {
      title: "3. Responsabilité",
      content: [
        "BidTounsi facilite les transactions entre utilisateurs mais n'est pas responsable des litiges entre vendeurs et acheteurs.",
        "La plateforme n'offre pas de garantie quant à la qualité des véhicules publiés.",
        "Les utilisateurs sont responsables de la vérification des informations des véhicules avant la transaction.",
        "BidTounsi décline toute responsabilité en cas d'utilisation frauduleuse de la plateforme."
      ]
    },
    {
      title: "4. Protection des Données",
      content: [
        "Les données personnelles collectées sont traitées conformément à la législation tunisienne.",
        "Nous n'utilisons vos données que pour améliorer nos services.",
        "Vos données ne sont jamais partagées avec des tiers sans votre consentement.",
        "Vous pouvez demander l'accès, la modification ou la suppression de vos données à tout moment."
      ]
    },
    {
      title: "5. Propriété Intellectuelle",
      content: [
        "Le contenu, design et fonctionnalités de BidTounsi sont protégés par les droits d'auteur.",
        "Vous ne pouvez pas reproduire, modifier ou distribuer le contenu de la plateforme sans permission.",
        "Les images et descriptions des véhicules restent la propriété de leurs auteurs respectifs.",
        "L'utilisation non autorisée peut entraîner des actions légales."
      ]
    },
    {
      title: "6. Limitation de Responsabilité",
      content: [
        "BidTounsi n'est pas responsable des dommages directs ou indirects résultant de l'utilisation de la plateforme.",
        "La plateforme est fournie 'en l'état' sans garantie d'aucune sorte.",
        "En cas de dysfonctionnement technique, nous ferons notre mieux pour résoudre le problème rapidement.",
        "Notre responsabilité totale ne dépasse pas le montant que vous avez payé sur la plateforme."
      ]
    },
    {
      title: "7. Règles de Modération",
      content: [
        "Les annonces doivent contenir des informations exactes et complètes.",
        "Les images doivent être claires et montrer l'état réel du véhicule.",
        "Les prix doivent être raisonnables et justifiés.",
        "Les messages spammés, agressifs ou trompeurs seront supprimés immédiatement.",
        "Les utilisateurs qui violent ces règles peuvent être bannis de la plateforme."
      ]
    },
    {
      title: "8. Litiges et Résolution",
      content: [
        "En cas de différend, nous vous encourageons à contacter l'autre partie directement.",
        "Si vous ne pouvez pas résoudre le problème, contactez notre équipe d'assistance.",
        "Nous travaillerons à trouver une solution juste pour toutes les parties.",
        "Les litiges peuvent être soumis à arbitrage conformément aux lois tunisiennes."
      ]
    },
    {
      title: "9. Frais et Paiements",
      content: [
        "Les services de base de BidTounsi sont gratuits.",
        "Les frais optionnels (mise en avant, etc.) seront clairement communiqués avant paiement.",
        "Les paiements sont traités de manière sécurisée par des fournisseurs de paiement de confiance.",
        "Les remboursements sont traités selon les conditions du service choisi."
      ]
    },
    {
      title: "10. Modifications des Conditions",
      content: [
        "BidTounsi se réserve le droit de modifier ces conditions à tout moment.",
        "Les modifications seront communiquées via email ou notification sur la plateforme.",
        "L'utilisation continue après modification signifie votre acceptation des nouvelles conditions.",
        "La date de dernière modification est indiquée au bas de cette page."
      ]
    }
  ];

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
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Mentions Légales
          </motion.h1>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Dernière mise à jour: 15 Novembre 2025
          </motion.p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <ul className="space-y-3">
                {section.content.map((text, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-600">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 p-8 md:p-12 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Questions sur nos Mentions Légales?</h2>
          <p className="text-gray-600 mb-8">
            Si vous avez des questions ou des préoccupations, veuillez nous contacter.
          </p>
          <div className="space-y-3">
            <p className="text-gray-700">
              <strong>Email:</strong> ayarisouhi@gmail.com
            </p>
            <p className="text-gray-700">
              <strong>Téléphone:</strong> +216 71 123 456
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
