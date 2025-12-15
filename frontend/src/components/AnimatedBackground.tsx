import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 80;
    let mouseX = 0;
    let mouseY = 0;

    class Particle {
      x: number;
      y: number;
      size: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      pulse: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.baseSize = Math.random() * 2 + 1;
        this.size = this.baseSize;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulse = Math.random() * Math.PI * 2;
      }

      update() {
        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.x -= dx * force * 0.02;
          this.y -= dy * force * 0.02;
        }

        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;

        // Pulsing effect
        this.pulse += 0.05;
        this.size = this.baseSize + Math.sin(this.pulse) * 0.5;
      }

      draw() {
        if (!ctx) return;
        
        // Particle glow
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, this.color + Math.floor(this.opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, this.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Particle core
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // Connect particles with gradient lines
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.5;
            const gradient = ctx!.createLinearGradient(
              particle.x, particle.y,
              otherParticle.x, otherParticle.y
            );
            gradient.addColorStop(0, particle.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(1, otherParticle.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            
            ctx!.strokeStyle = gradient;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particle.x, particle.y);
            ctx!.lineTo(otherParticle.x, otherParticle.y);
            ctx!.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40 -z-10"
    />
  );
}

// Composant de grille 3D animée
export function Grid3D() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        transform: 'perspective(500px) rotateX(60deg)',
        transformOrigin: 'center center',
      }} />
    </div>
  );
}

// Orbes flottantes améliorées avec effets multiples
export function FloatingOrbs() {
  const orbs = [
    { 
      colors: ['from-blue-400 via-blue-500 to-blue-600', 'from-blue-500 via-indigo-500 to-purple-600'],
      delay: 0, 
      duration: 25, 
      size: 'w-96 h-96', 
      position: 'top-20 -left-48',
      path: { y: [-50, -150, -50], x: [-20, 30, -20], rotate: [0, 180, 360] }
    },
    { 
      colors: ['from-purple-400 via-purple-500 to-purple-600', 'from-purple-500 via-pink-500 to-red-500'],
      delay: 5, 
      duration: 30, 
      size: 'w-[32rem] h-[32rem]', 
      position: 'bottom-20 -right-64',
      path: { y: [0, 120, 0], x: [0, -80, 0], rotate: [0, -180, -360] }
    },
    { 
      colors: ['from-pink-400 via-pink-500 to-pink-600', 'from-pink-500 via-rose-500 to-red-600'],
      delay: 10, 
      duration: 28, 
      size: 'w-80 h-80', 
      position: 'top-1/2 left-1/4',
      path: { y: [-80, 80, -80], x: [0, 60, 0], rotate: [0, 90, 180] }
    },
    { 
      colors: ['from-emerald-400 via-green-500 to-teal-600', 'from-green-500 via-emerald-500 to-cyan-600'],
      delay: 15, 
      duration: 26, 
      size: 'w-72 h-72', 
      position: 'bottom-1/3 right-1/4',
      path: { y: [60, -60, 60], x: [-40, 40, -40], rotate: [0, -90, -180] }
    },
    { 
      colors: ['from-amber-400 via-orange-500 to-red-600', 'from-yellow-500 via-orange-500 to-red-600'],
      delay: 8, 
      duration: 32, 
      size: 'w-64 h-64', 
      position: 'top-1/3 right-1/3',
      path: { y: [0, -100, 0], x: [0, 50, 0], rotate: [0, 120, 240] }
    },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute ${orb.size} ${orb.position}`}
          animate={{
            y: orb.path.y,
            x: orb.path.x,
            rotate: orb.path.rotate,
            scale: [1, 1.15, 0.95, 1.1, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        >
          {/* Orbe principale avec gradient animé */}
          <motion.div
            className={`w-full h-full rounded-full blur-3xl opacity-25 bg-gradient-to-br ${orb.colors[0]}`}
            animate={{
              opacity: [0.15, 0.3, 0.2, 0.25],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Couche secondaire */}
          <motion.div
            className={`absolute inset-0 w-full h-full rounded-full blur-2xl opacity-20 bg-gradient-to-tr ${orb.colors[1]}`}
            animate={{
              scale: [0.8, 1.2, 0.9, 1],
              opacity: [0.1, 0.25, 0.15, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: orb.delay + 2,
            }}
          />

          {/* Anneau extérieur pulsant */}
          <motion.div
            className={`absolute inset-0 w-full h-full rounded-full blur-xl opacity-10 bg-gradient-to-br ${orb.colors[0]}`}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: orb.delay + 1,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
