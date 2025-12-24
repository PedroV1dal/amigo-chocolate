import { useState, useEffect, useCallback } from "react";

export type GameState = "home" | "registration" | "drawing" | "finished";

interface DrawResult {
  drawer: string;
  drawn: string;
}

export const useSecretSanta = () => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>("home");
  const [drawOrder, setDrawOrder] = useState<string[]>([]);
  const [drawResults, setDrawResults] = useState<DrawResult[]>([]);
  const [currentDrawerIndex, setCurrentDrawerIndex] = useState(0);
  const [currentDrawnName, setCurrentDrawnName] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedParticipants = localStorage.getItem("secretSanta_participants");
    const savedState = localStorage.getItem("secretSanta_state");
    const savedDrawOrder = localStorage.getItem("secretSanta_drawOrder");
    const savedDrawResults = localStorage.getItem("secretSanta_drawResults");
    const savedCurrentIndex = localStorage.getItem("secretSanta_currentIndex");

    if (savedParticipants) setParticipants(JSON.parse(savedParticipants));
    if (savedState) setGameState(savedState as GameState);
    if (savedDrawOrder) setDrawOrder(JSON.parse(savedDrawOrder));
    if (savedDrawResults) setDrawResults(JSON.parse(savedDrawResults));
    if (savedCurrentIndex) setCurrentDrawerIndex(parseInt(savedCurrentIndex));
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("secretSanta_participants", JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem("secretSanta_state", gameState);
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem("secretSanta_drawOrder", JSON.stringify(drawOrder));
  }, [drawOrder]);

  useEffect(() => {
    localStorage.setItem("secretSanta_drawResults", JSON.stringify(drawResults));
  }, [drawResults]);

  useEffect(() => {
    localStorage.setItem("secretSanta_currentIndex", currentDrawerIndex.toString());
  }, [currentDrawerIndex]);

  const addParticipant = useCallback((name: string) => {
    const trimmedName = name.trim();
    if (trimmedName && !participants.includes(trimmedName)) {
      setParticipants(prev => [...prev, trimmedName]);
      return true;
    }
    return false;
  }, [participants]);

  const editParticipant = useCallback((index: number, newName: string) => {
    const trimmedName = newName.trim();
    if (trimmedName && !participants.includes(trimmedName)) {
      setParticipants(prev => {
        const updated = [...prev];
        updated[index] = trimmedName;
        return updated;
      });
      return true;
    }
    return false;
  }, [participants]);

  const removeParticipant = useCallback((index: number) => {
    setParticipants(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Fisher-Yates shuffle that ensures no one draws themselves
  const createValidDraw = useCallback((names: string[]): string[] => {
    let attempts = 0;
    const maxAttempts = 1000;
    
    while (attempts < maxAttempts) {
      const shuffled = [...names];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      // Check if anyone drew themselves
      const isValid = names.every((name, index) => name !== shuffled[index]);
      if (isValid) return shuffled;
      
      attempts++;
    }
    
    // Fallback: shift by one position
    return [...names.slice(1), names[0]];
  }, []);

  const startDrawing = useCallback(() => {
    if (participants.length < 3) return false;
    
    const shuffledDrawers = [...participants].sort(() => Math.random() - 0.5);
    const drawnNames = createValidDraw(shuffledDrawers);
    
    setDrawOrder(shuffledDrawers);
    setDrawResults([]);
    setCurrentDrawerIndex(0);
    setCurrentDrawnName(null);
    setGameState("drawing");
    
    // Store the full mapping for later use
    localStorage.setItem("secretSanta_drawnNames", JSON.stringify(drawnNames));
    
    return true;
  }, [participants, createValidDraw]);

  const performDraw = useCallback(() => {
    const drawnNames = JSON.parse(localStorage.getItem("secretSanta_drawnNames") || "[]");
    const drawn = drawnNames[currentDrawerIndex];
    setCurrentDrawnName(drawn);
    return drawn;
  }, [currentDrawerIndex]);

  const confirmDraw = useCallback(() => {
    if (currentDrawnName) {
      const newResult = {
        drawer: drawOrder[currentDrawerIndex],
        drawn: currentDrawnName,
      };
      setDrawResults(prev => [...prev, newResult]);
      setCurrentDrawnName(null);
      
      if (currentDrawerIndex === drawOrder.length - 1) {
        setGameState("finished");
      } else {
        setCurrentDrawerIndex(prev => prev + 1);
      }
    }
  }, [currentDrawnName, drawOrder, currentDrawerIndex]);

  const resetGame = useCallback(() => {
    setParticipants([]);
    setGameState("home");
    setDrawOrder([]);
    setDrawResults([]);
    setCurrentDrawerIndex(0);
    setCurrentDrawnName(null);
    
    localStorage.removeItem("secretSanta_participants");
    localStorage.removeItem("secretSanta_state");
    localStorage.removeItem("secretSanta_drawOrder");
    localStorage.removeItem("secretSanta_drawResults");
    localStorage.removeItem("secretSanta_currentIndex");
    localStorage.removeItem("secretSanta_drawnNames");
  }, []);

  const startGame = useCallback(() => {
    setGameState("registration");
  }, []);

  return {
    participants,
    gameState,
    drawOrder,
    drawResults,
    currentDrawerIndex,
    currentDrawnName,
    currentDrawer: drawOrder[currentDrawerIndex],
    isLastDraw: currentDrawerIndex === drawOrder.length - 1,
    isPenultimateDraw: currentDrawerIndex === drawOrder.length - 2,
    addParticipant,
    editParticipant,
    removeParticipant,
    startGame,
    startDrawing,
    performDraw,
    confirmDraw,
    resetGame,
  };
};
