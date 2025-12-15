import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { FeaturesSection } from "./FeaturesSection";
import { StatsSection } from "./StatsSection";
import { Footer } from "./Footer";
import { FloatingOrbs, Grid3D } from "./AnimatedBackground";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Arrière-plans 3D animés */}
      <FloatingOrbs />
      <Grid3D />
      
      <Header onNavigate={onNavigate} />
      <main className="relative z-10">
        <HeroSection onNavigate={onNavigate} />
        <AboutSection />
        <FeaturesSection />
        <StatsSection />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}