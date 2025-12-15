import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { User, Vehicle, Bid } from "../types";
import { motion } from "motion/react";

export function StatsSection() {
  const [stats, setStats] = useState({
    soldVehicles: 0,
    totalUsers: 0,
    totalBids: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    // Charger les véhicules vendus
    const allVehicles: Vehicle[] = JSON.parse(localStorage.getItem('bidtounsi_vehicles') || '[]');
    const soldVehicles = allVehicles.filter(v => v.status === 'sold').length;

    // Charger le nombre total d'utilisateurs (vendeurs + acheteurs, sans admin)
    const allUsers: User[] = JSON.parse(localStorage.getItem('bidtounsi_users') || '[]');
    const totalUsers = allUsers.filter(u => u.userType !== 'admin').length;

    // Charger le nombre total d'enchères
    const allBids: Bid[] = JSON.parse(localStorage.getItem('bidtounsi_bids') || '[]');
    const totalBids = allBids.length;

    setStats({
      soldVehicles,
      totalUsers,
      totalBids
    });
  };

  const statItems = [
    { value: stats.soldVehicles, label: "Véhicules vendus", color: "from-blue-400 to-blue-600" },
    { value: stats.totalUsers, label: "Entreprises partenaires", color: "from-purple-400 to-purple-600" },
    { value: stats.totalBids, label: "Enchères effectuées", color: "from-pink-400 to-pink-600" }
  ];

  return (
    <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardContent className="py-12">
              <motion.h3 
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-8 sm:mb-12 text-center px-4"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {stats.soldVehicles > 0 
                  ? `Déjà ${stats.soldVehicles} véhicule${stats.soldVehicles > 1 ? 's' : ''} vendu${stats.soldVehicles > 1 ? 's' : ''} grâce à BidTounsi`
                  : "Rejoignez BidTounsi dès aujourd'hui"}
              </motion.h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {statItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.2,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                      {/* Gradient glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-300`} />
                      
                      <div className="relative z-10 text-center">
                        <motion.div 
                          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 0.3 }}
                        >
                          <CountUpAnimation value={item.value} />
                        </motion.div>
                        <div className="text-sm sm:text-base text-blue-100">{item.label}</div>
                      </div>

                      {/* Corner decorations */}
                      <div className="absolute top-2 right-2 w-3 h-3 bg-white/30 rounded-full" />
                      <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/20 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// Component to animate counting up
function CountUpAnimation({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 50;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
}