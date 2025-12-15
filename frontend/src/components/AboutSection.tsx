import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CheckCircle2, Shield, Zap, TrendingUp, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: CheckCircle2,
    title: "Simplicité",
    description: "Interface intuitive et facile à utiliser",
    color: "text-green-600 bg-green-100"
  },
  {
    icon: Shield,
    title: "Sécurité",
    description: "Transactions sécurisées et transparentes",
    color: "text-blue-600 bg-blue-100"
  },
  {
    icon: Zap,
    title: "Rapidité",
    description: "Enchères en temps réel, résultats instantanés",
    color: "text-yellow-600 bg-yellow-100"
  },
  {
    icon: TrendingUp,
    title: "Rentabilité",
    description: "Maximisez la valeur de vos véhicules",
    color: "text-purple-600 bg-purple-100"
  }
];

export function AboutSection() {
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
        style={{ y, opacity }}
      />
      <motion.div 
        className="absolute bottom-20 left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ['50%', '-50%']),
          opacity 
        }}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge premium */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-blue-500/20 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Plateforme Innovante
            </span>
          </motion.div>

          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Pourquoi{" "}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">
                BidTounsi
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>{" "}
            ?
          </motion.h2>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            BidTounsi est une <strong className="text-gray-900">solution innovante</strong> qui connecte les sociétés souhaitant vendre leurs véhicules d'entreprise 
            avec les agences spécialisées dans l'achat de voitures d'occasion. Grâce à notre <strong className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">système d'enchères</strong>, 
            la vente et l'achat deviennent rapides, sécurisés et transparents.
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={!isMobile ? { y: -5 } : {}}
              >
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-gray-300 transition-all duration-300 h-full">
                  {/* Icon */}
                  <motion.div
                    className={`w-14 h-14 rounded-xl ${benefit.color} flex items-center justify-center mb-4 shadow-md`}
                    whileHover={!isMobile ? { rotate: 360, scale: 1.1 } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent className="w-7 h-7" />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}