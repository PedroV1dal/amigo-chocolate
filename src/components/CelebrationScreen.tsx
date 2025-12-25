import { useEffect } from "react";
import confetti from "canvas-confetti";
import { RotateCcw, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DrawResult {
  drawer: string;
  drawn: string;
}

interface CelebrationScreenProps {
  results: DrawResult[];
  onReset: () => void;
}

const CelebrationScreen = ({ results, onReset }: CelebrationScreenProps) => {
  useEffect(() => {
    // Fire confetti on mount
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const colors = ['#c41e3a', '#228b22', '#ffd700', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst at the start
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });
  }, []);

  const lastResult = results[results.length - 1];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-20">
      <div className="w-full max-w-lg text-center animate-fade-in">
        {/* Celebration Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 mb-6 animate-pulse-glow">
            <PartyPopper className="w-12 h-12 text-accent" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            🎉 Sorteio <span className="text-accent">Concluído!</span> 🎉
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Todos os participantes foram sorteados com sucesso!
          </p>
        </div>

        {/* Last Result Highlight */}
        {lastResult && (
          <div className="glass-card p-6 mb-8 border-2 border-accent/50 animate-scale-in">
            <p className="text-sm text-muted-foreground mb-2">Último sorteado:</p>
            <div className="flex items-center justify-center gap-4 text-2xl">
              <span className="font-semibold">{lastResult.drawer}</span>
              <span className="text-accent">→</span>
              <span className="font-bold text-accent">{lastResult.drawn}</span>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="glass-card p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">Resumo do Sorteio</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-2"
              >
                <span className="font-medium">{result.drawer}</span>
                <span className="text-accent font-semibold">🎁 {result.drawn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-bold text-primary">{results.length}</p>
            <p className="text-sm text-muted-foreground">Participantes</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-3xl font-bold text-accent">✓</p>
            <p className="text-sm text-muted-foreground">Sorteio válido</p>
          </div>
        </div>

        {/* Decorative message */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20">
          <p className="text-lg">
            🎄 Feliz Natal e boas trocas de chocolates! 🍫
          </p>
        </div>

        {/* Reset Button */}
        <Button
          onClick={onReset}
          variant="outline"
          className="px-8 py-4 h-auto text-lg border-2 border-border hover:bg-muted"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Novo Amigo Chocolate
        </Button>
      </div>
    </div>
  );
};

export default CelebrationScreen;
