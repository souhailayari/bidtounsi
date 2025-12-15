import { ReactNode, useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export function Card3D({ children, className = '', glowColor = 'blue', intensity = 1 }: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  
  const gradientX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const gradientY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angleX = ((e.clientY - centerY) / (rect.height / 2)) * -15 * intensity;
    const angleY = ((e.clientX - centerX) / (rect.width / 2)) * 15 * intensity;
    
    rotateX.set(angleX);
    rotateY.set(angleY);
    
    const gradientPosX = ((e.clientX - rect.left) / rect.width) * 100;
    const gradientPosY = ((e.clientY - rect.top) / rect.height) * 100;
    
    mouseX.set(gradientPosX);
    mouseY.set(gradientPosY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  };

  const glowColors = {
    blue: {
      primary: 'rgba(59, 130, 246, 0.6)',
      secondary: 'rgba(37, 99, 235, 0.4)',
      gradient: 'from-blue-500/20 via-blue-600/20 to-purple-500/20'
    },
    purple: {
      primary: 'rgba(168, 85, 247, 0.6)',
      secondary: 'rgba(147, 51, 234, 0.4)',
      gradient: 'from-purple-500/20 via-purple-600/20 to-pink-500/20'
    },
    green: {
      primary: 'rgba(34, 197, 94, 0.6)',
      secondary: 'rgba(22, 163, 74, 0.4)',
      gradient: 'from-green-500/20 via-emerald-600/20 to-teal-500/20'
    },
    orange: {
      primary: 'rgba(249, 115, 22, 0.6)',
      secondary: 'rgba(234, 88, 12, 0.4)',
      gradient: 'from-orange-500/20 via-amber-600/20 to-yellow-500/20'
    },
    pink: {
      primary: 'rgba(236, 72, 153, 0.6)',
      secondary: 'rgba(219, 39, 119, 0.4)',
      gradient: 'from-pink-500/20 via-rose-600/20 to-red-500/20'
    },
  };

  const currentGlow = glowColors[glowColor as keyof typeof glowColors] || glowColors.blue;

  return (
    <div
      ref={cardRef}
      className={`perspective-[1200px] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Glow effect multicouches */}
        <motion.div
          className="absolute -inset-2 rounded-3xl blur-2xl -z-10"
          animate={{
            opacity: isHovered ? 0.8 : 0,
            scale: isHovered ? 1.05 : 0.95,
          }}
          style={{
            background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, ${currentGlow.primary}, ${currentGlow.secondary})`,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Glow secondaire */}
        <motion.div
          className="absolute -inset-4 rounded-3xl blur-3xl -z-20"
          animate={{
            opacity: isHovered ? 0.4 : 0,
            scale: isHovered ? 1.1 : 0.9,
          }}
          style={{
            background: currentGlow.primary,
          }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Card container */}
        <div
          className="relative bg-gradient-to-br from-white/[0.12] to-white/[0.08] backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
          style={{
            transform: "translateZ(50px)",
          }}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${currentGlow.gradient} opacity-0`}
            animate={{
              opacity: isHovered ? 0.3 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Shine effect amélioré */}
          <motion.div
            className="absolute inset-0 opacity-0"
            style={{
              background: `radial-gradient(600px circle at ${gradientX}% ${gradientY}%, rgba(255,255,255,0.4), transparent 40%)`,
            }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          />

          {/* Particle effect on hover */}
          {isHovered && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  initial={{
                    x: Math.random() * 100 + '%',
                    y: '100%',
                    opacity: 0,
                  }}
                  animate={{
                    y: '-10%',
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          )}

          {/* Border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, transparent 0%, ${currentGlow.primary} 50%, transparent 100%)`,
              opacity: 0,
            }}
            animate={{
              opacity: isHovered ? 0.2 : 0,
            }}
          />
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>

        {/* Depth shadow layers */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 rounded-2xl blur-sm -z-30"
          style={{
            transform: "translateZ(-20px)",
          }}
        />
        <div
          className="absolute inset-0 bg-black/10 rounded-2xl blur-md -z-40"
          style={{
            transform: "translateZ(-40px)",
          }}
        />
      </motion.div>
    </div>
  );
}
