import { useState, useEffect, Suspense } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Car3DScene } from "./Car3DScene";

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Détecter si c'est mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      // Désactiver le parallaxe sur mobile
      if (window.innerWidth < 768) return;
      
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background 3D Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 sm:top-20 left-10 sm:left-20 w-40 h-40 sm:w-64 sm:h-64 bg-blue-400/20 rounded-full blur-3xl"
          animate={!isMobile ? {
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          } : {}}
          transition={{ type: "spring", stiffness: 50 }}
        />
        <motion.div
          className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-60 h-60 sm:w-96 sm:h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={!isMobile ? {
            x: -mousePosition.x * 1.5,
            y: -mousePosition.y * 1.5,
          } : {}}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Contenu texte */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Plateforme N°1 en Tunisie</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                La plateforme digitale pour la vente et l'achat de{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  véhicules professionnels
                </span>
              </motion.h1>
              
              <motion.h2 
                className="text-base sm:text-lg md:text-xl text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Simplifiez vos transactions : publiez vos voitures, participez aux enchères et trouvez la meilleure offre en toute transparence.
              </motion.h2>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                onClick={() => onNavigate('login')}
              >
                Se connecter
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Scène 3D avec voiture */}
          <motion.div 
            className="relative perspective-1000 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Container 3D avec effets premium */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
              {/* Glow effect multicouches */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/10 via-transparent to-pink-500/10" />
              
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }} />
              
              {/* Three.js Scene */}
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
                  <div className="text-white text-center space-y-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
                    />
                    <div className="space-y-2">
                      <p className="font-medium">Chargement de la scène 3D...</p>
                      <p className="text-sm text-gray-400">Préparation du modèle premium</p>
                    </div>
                  </div>
                </div>
              }>
                <Car3DScene />
              </Suspense>

              {/* Badge 3D Interactive - Amélioré */}
              <motion.div
                className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="bg-white/10 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/20 shadow-xl">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </motion.div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white text-sm">Vitrine 3D Interactive</span>
                      <span className="text-xs text-gray-300">Rotation 360° • Zoom • Lumières</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Indicateur de contrôle - Desktop */}
              <motion.div
                className="hidden sm:block absolute top-4 left-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="bg-white/10 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/20 shadow-lg">
                  <div className="flex items-center gap-2 text-white text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-medium">Utilisez votre souris</span>
                  </div>
                </div>
              </motion.div>

              {/* Indicateur de contrôle - Mobile */}
              <motion.div
                className="sm:hidden absolute top-4 left-4 right-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="bg-white/10 backdrop-blur-xl px-3 py-2 rounded-xl border border-white/20 shadow-lg">
                  <div className="flex items-center gap-2 text-white text-xs justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-medium">Rotation automatique activée</span>
                  </div>
                </div>
              </motion.div>

              {/* Corners decoration */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-400/50 rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-400/50 rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-purple-400/50 rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-400/50 rounded-br-3xl" />
            </div>
            
            {/* Floating elements premium - cachés sur mobile */}
            <motion.div
              className="hidden lg:block absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl shadow-2xl backdrop-blur-sm"
              animate={{
                y: [0, -25, 0],
                rotate: [0, 12, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-white text-3xl relative">
                🚗
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-3xl"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
            
            <motion.div
              className="hidden lg:block absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl shadow-2xl backdrop-blur-sm"
              animate={{
                y: [0, 25, 0],
                rotate: [0, -12, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-white text-2xl relative">
                ⚡
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-2xl"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:block absolute top-1/2 -left-8 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl backdrop-blur-sm"
              animate={{
                x: [0, -10, 0],
                rotate: [0, 15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-white text-xl">
                💎
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}