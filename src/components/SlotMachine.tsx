import { useState, useEffect } from "react";

interface SlotMachineProps {
  names: string[];
  finalName: string;
  onComplete: () => void;
}

const SlotMachine = ({ names, finalName, onComplete }: SlotMachineProps) => {
  const [currentName, setCurrentName] = useState(names[0] || "");
  const [isSpinning, setIsSpinning] = useState(true);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    if (!isSpinning) return;

    let counter = 0;
    const totalSpins = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setCurrentName(names[randomIndex]);
      counter++;

      if (counter >= totalSpins) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentName(finalName);
          setIsSpinning(false);
          setShowFinal(true);
          setTimeout(onComplete, 500);
        }, 200);
      }
    }, 100 + counter * 10);

    return () => clearInterval(interval);
  }, [names, finalName, isSpinning, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-muted to-card border-4 border-accent/50 shadow-glow">
        <div className="px-12 py-8 min-w-[280px] text-center">
          <div
            className={`text-3xl md:text-4xl font-display font-bold transition-all duration-200 ${
              showFinal 
                ? "text-accent animate-scale-in" 
                : "text-foreground"
            }`}
          >
            {currentName}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-background/50 to-transparent" />
      </div>
      
      {isSpinning && (
        <p className="mt-4 text-muted-foreground animate-pulse">
          Sorteando... 🎰
        </p>
      )}
      
      {showFinal && (
        <div className="mt-6 text-center animate-fade-in">
          <p className="text-xl text-accent font-semibold">🎁 Você tirou:</p>
          <p className="text-2xl font-display font-bold mt-2">{finalName}</p>
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
