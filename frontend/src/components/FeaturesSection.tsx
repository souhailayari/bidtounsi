import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Plus, Gavel, Settings, Clock } from "lucide-react";
import { motion } from "motion/react";
import { Card3D } from "./Card3D";

const features = [
  {
    icon: Plus,
    title: "Publier des annonces",
    description: "Ajoutez une ou plusieurs voitures avec photos, détails et prix de départ.",
    color: "text-blue-600 bg-blue-100",
    gradient: "from-blue-500 to-blue-600",
    glowColor: "blue"
  },
  {
    icon: Gavel,
    title: "Participer aux enchères",
    description: "Les agences peuvent consulter les annonces et soumettre leurs offres.",
    color: "text-green-600 bg-green-100",
    gradient: "from-green-500 to-green-600",
    glowColor: "green"
  },
  {
    icon: Settings,
    title: "Gestion simplifiée",
    description: "Suivez l'état de chaque offre : En attente, Disponible, Terminé.",
    color: "text-orange-600 bg-orange-100",
    gradient: "from-orange-500 to-orange-600",
    glowColor: "orange"
  },
  {
    icon: Clock,
    title: "Transparence et rapidité",
    description: "Chaque vente est limitée dans le temps (30 jours max) pour accélérer le processus.",
    color: "text-purple-600 bg-purple-100",
    gradient: "from-purple-500 to-purple-600",
    glowColor: "purple"
  }
];

export function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-blue-200 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-60 sm:w-80 h-60 sm:h-80 bg-purple-200 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Fonctionnalités principales
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Découvrez comment BidTounsi révolutionne le marché des véhicules professionnels
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {isMobile ? (
                  // Version mobile simple
                  <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-2xl ${feature.color} flex items-center justify-center mb-4 shadow-md`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ) : (
                  // Version desktop avec effet 3D
                  <Card3D glowColor={feature.glowColor} className="h-full">
                    <CardHeader className="text-center p-6">
                      <motion.div 
                        className={`w-16 h-16 mx-auto rounded-2xl ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                        whileHover={{
                          rotateY: 360,
                          scale: 1.1,
                        }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        <IconComponent className="w-8 h-8" />
                      </motion.div>
                      <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <CardDescription className="text-center text-gray-200">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card3D>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}