import { useState, useEffect } from "react";
import { Shuffle, ArrowRight, Gift, PartyPopper, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SlotMachine from "./SlotMachine";

interface DrawingScreenProps {
  currentDrawer: string;
  currentDrawerIndex: number;
  totalParticipants: number;
  availableToDraw: string[];
  isLastDraw: boolean;
  isPenultimateDraw: boolean;
  onDraw: () => string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DrawingScreen = ({
  currentDrawer,
  currentDrawerIndex,
  totalParticipants,
  availableToDraw,
  isLastDraw,
  isPenultimateDraw,
  onDraw,
  onConfirm,
  onCancel,
}: DrawingScreenProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnName, setDrawnName] = useState<string | null>(null);
  const [showSlotMachine, setShowSlotMachine] = useState(false);
  const [showFinalReveal, setShowFinalReveal] = useState(false);
  const [revealStep, setRevealStep] = useState(0);

  const handleDraw = () => {
    if (isLastDraw) {
      // Último sorteio - animação especial de revelação
      setShowFinalReveal(true);
      setRevealStep(1);
      const result = onDraw();
      setDrawnName(result);
      
      // Animação em etapas
      setTimeout(() => setRevealStep(2), 800);
      setTimeout(() => setRevealStep(3), 1600);
      setTimeout(() => {
        setRevealStep(4);
        setIsDrawing(false);
      }, 2400);
    } else {
      // Sorteio normal com slot machine
      setIsDrawing(true);
      setShowSlotMachine(true);
      const result = onDraw();
      setDrawnName(result);
    }
  };

  const handleSlotComplete = () => {
    setIsDrawing(false);
  };

  const handleNext = () => {
    setDrawnName(null);
    setShowSlotMachine(false);
    setShowFinalReveal(false);
    setRevealStep(0);
    onConfirm();
  };

  const progress = ((currentDrawerIndex + 1) / totalParticipants) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-20">
      {/* Cancel Button - Fixed at top right */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={onCancel}
          variant="outline"
          className="bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar Rodada
        </Button>
      </div>

      <div className="w-full max-w-lg animate-fade-in">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progresso do sorteio</span>
            <span>{currentDrawerIndex + 1} de {totalParticipants}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="glass-card p-8 text-center mb-6">
          {showFinalReveal ? (
            // Animação especial para o último sorteio
            <div className="py-8">
              {revealStep >= 1 && (
                <div className="animate-fade-in mb-4">
                  <Sparkles className="w-12 h-12 text-gold mx-auto animate-pulse-glow" />
                </div>
              )}
              
              {revealStep >= 2 && (
                <div className="animate-fade-in mb-4">
                  <p className="text-lg text-muted-foreground">Revelando a vencedora...</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    ({currentDrawer} está sorteando)
                  </p>
                </div>
              )}
              
              {revealStep >= 3 && (
                <div className="animate-scale-in my-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mb-4 animate-pulse-glow">
                    <Gift className="w-12 h-12 text-white" />
                  </div>
                </div>
              )}
              
              {revealStep >= 4 && drawnName && (
                <div className="animate-scale-in">
                  <p className="text-4xl md:text-5xl font-display font-bold text-gold mb-8">
                    🎁 {drawnName} 🎁
                  </p>
                  <Button
                    onClick={handleNext}
                    className="bg-accent text-accent-foreground animate-pulse-glow text-lg px-10 py-5 h-auto"
                  >
                    <PartyPopper className="mr-2 h-5 w-5" />
                    🎉 Ver Resultado Final!
                  </Button>
                </div>
              )}
            </div>
          ) : !showSlotMachine ? (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
                  {isLastDraw ? (
                    <Sparkles className="w-10 h-10 text-gold animate-pulse-glow" />
                  ) : (
                    <Gift className="w-10 h-10 text-primary" />
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                  {isLastDraw ? "🎄 Último Sorteio! 🎄" : "Vez de sortear:"}
                </h2>
                <p className="text-3xl md:text-4xl font-bold text-accent">
                  {currentDrawer}
                </p>
                {isLastDraw && (
                  <p className="text-muted-foreground mt-2">
                    Resta apenas uma pessoa para ser sorteada!
                  </p>
                )}
              </div>

              <Button
                onClick={handleDraw}
                disabled={isDrawing}
                className={`text-lg px-10 py-5 h-auto ${
                  isLastDraw ? "bg-gold text-gold-foreground hover:bg-gold/90 animate-pulse-glow" : "btn-christmas"
                }`}
              >
                {isLastDraw ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Revelar o Último!
                  </>
                ) : (
                  <>
                    <Shuffle className="mr-2 h-5 w-5" />
                    Sortear Próximo
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="py-4">
              <h2 className="text-xl md:text-2xl font-display font-bold mb-6">
                <span className="text-accent">{currentDrawer}</span> está sorteando...
              </h2>
              
              <SlotMachine
                names={availableToDraw}
                finalName={drawnName || ""}
                onComplete={handleSlotComplete}
              />

              {drawnName && !isDrawing && (
                <div className="mt-8 animate-fade-in">
                  <Button
                    onClick={handleNext}
                    className="btn-christmas text-lg px-10 py-5 h-auto"
                  >
                    {isPenultimateDraw ? (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Revelar Último Sorteado!
                      </>
                    ) : (
                      <>
                        <ArrowRight className="mr-2 h-5 w-5" />
                        Próximo
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Waiting list - hide when showing final reveal or is last draw */}
        {!isLastDraw && !showFinalReveal && (
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Disponíveis para sortear:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableToDraw.map((name, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawingScreen;
