import { useState } from "react";
import { Shuffle, ArrowRight, Gift, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import SlotMachine from "./SlotMachine";

interface DrawingScreenProps {
  currentDrawer: string;
  currentDrawerIndex: number;
  totalParticipants: number;
  participants: string[];
  isLastDraw: boolean;
  isPenultimateDraw: boolean;
  onDraw: () => string;
  onConfirm: () => void;
}

const DrawingScreen = ({
  currentDrawer,
  currentDrawerIndex,
  totalParticipants,
  participants,
  isLastDraw,
  isPenultimateDraw,
  onDraw,
  onConfirm,
}: DrawingScreenProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnName, setDrawnName] = useState<string | null>(null);
  const [showSlotMachine, setShowSlotMachine] = useState(false);

  const handleDraw = () => {
    setIsDrawing(true);
    setShowSlotMachine(true);
    const result = onDraw();
    setDrawnName(result);
  };

  const handleSlotComplete = () => {
    setIsDrawing(false);
  };

  const handleNext = () => {
    setDrawnName(null);
    setShowSlotMachine(false);
    onConfirm();
  };

  const progress = ((currentDrawerIndex + 1) / totalParticipants) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10">
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
          {!showSlotMachine ? (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
                  <Gift className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
                  Vez de sortear:
                </h2>
                <p className="text-3xl md:text-4xl font-bold text-accent">
                  {currentDrawer}
                </p>
              </div>

              <Button
                onClick={handleDraw}
                disabled={isDrawing}
                className="btn-christmas text-lg px-10 py-5 h-auto"
              >
                <Shuffle className="mr-2 h-5 w-5" />
                Sortear Próximo
              </Button>
            </>
          ) : (
            <div className="py-4">
              <h2 className="text-xl md:text-2xl font-display font-bold mb-6">
                <span className="text-accent">{currentDrawer}</span> está sorteando...
              </h2>
              
              <SlotMachine
                names={participants.filter(p => p !== currentDrawer)}
                finalName={drawnName || ""}
                onComplete={handleSlotComplete}
              />

              {drawnName && !isDrawing && (
                <div className="mt-8 animate-fade-in">
                  <Button
                    onClick={handleNext}
                    className={`text-lg px-10 py-5 h-auto ${
                      isLastDraw 
                        ? "bg-accent text-accent-foreground animate-pulse-glow" 
                        : "btn-christmas"
                    }`}
                  >
                    {isLastDraw ? (
                      <>
                        <PartyPopper className="mr-2 h-5 w-5" />
                        🎉 Ver Resultado Final!
                      </>
                    ) : isPenultimateDraw ? (
                      <>
                        <Gift className="mr-2 h-5 w-5" />
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

        {/* Waiting list */}
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Aguardando sortear:
          </p>
          <div className="flex flex-wrap gap-2">
            {participants.slice(currentDrawerIndex + 1).map((name, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-muted/50 rounded-full text-sm text-muted-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingScreen;
