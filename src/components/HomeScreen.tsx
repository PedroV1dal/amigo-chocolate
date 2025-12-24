import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeScreenProps {
  onStart: () => void;
}

const HomeScreen = ({ onStart }: HomeScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <div className="text-center animate-fade-in">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-christmas-red-light shadow-festive animate-float">
            <Gift className="w-16 h-16 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 text-foreground">
          Amigo <span className="text-accent">Chocolate</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-2">
          🎄 Edição de Natal 2025 🎄
        </p>
        
        <p className="text-muted-foreground mb-12 max-w-md mx-auto">
          Organize seu amigo secreto de forma divertida e fácil. 
          Adicione os participantes, faça o sorteio e celebre!
        </p>

        {/* CTA Button */}
        <Button
          onClick={onStart}
          size="lg"
          className="btn-christmas text-xl px-12 py-6 h-auto"
        >
          <Gift className="mr-3 h-6 w-6" />
          Iniciar Amigo Chocolate
        </Button>

        {/* Decorative elements */}
        <div className="mt-16 flex justify-center gap-8 text-4xl opacity-60">
          <span className="animate-float" style={{ animationDelay: '0s' }}>🍫</span>
          <span className="animate-float" style={{ animationDelay: '0.5s' }}>🎁</span>
          <span className="animate-float" style={{ animationDelay: '1s' }}>🎅</span>
          <span className="animate-float" style={{ animationDelay: '1.5s' }}>🦌</span>
          <span className="animate-float" style={{ animationDelay: '2s' }}>❄️</span>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
