import { Header } from "./Header";
import { Footer } from "./Footer";
import { ContactSection } from "./ContactSection";
import { FloatingOrbs, Grid3D } from "./AnimatedBackground";

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Arrière-plans 3D animés */}
      <FloatingOrbs />
      <Grid3D />
      
      <Header onNavigate={onNavigate} />
      <main className="relative z-10 pt-20">
        <ContactSection />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
