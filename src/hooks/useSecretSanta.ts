import { useState, useEffect, useCallback } from "react";

export type GameState = "home" | "registration" | "drawing" | "finished";

interface DrawResult {
  drawer: string;
  drawn: string;
}

export const useSecretSanta = () => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>("home");
  const [drawResults, setDrawResults] = useState<DrawResult[]>([]);
  const [currentDrawer, setCurrentDrawer] = useState<string | null>(null);
  const [currentDrawnName, setCurrentDrawnName] = useState<string | null>(null);
  const [availableToDraw, setAvailableToDraw] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedParticipants = localStorage.getItem("secretSanta_participants");
    const savedState = localStorage.getItem("secretSanta_state");
    const savedDrawResults = localStorage.getItem("secretSanta_drawResults");
    const savedCurrentDrawer = localStorage.getItem("secretSanta_currentDrawer");
    const savedAvailable = localStorage.getItem("secretSanta_available");

    if (savedParticipants) setParticipants(JSON.parse(savedParticipants));
    if (savedState) setGameState(savedState as GameState);
    if (savedDrawResults) setDrawResults(JSON.parse(savedDrawResults));
    if (savedCurrentDrawer) setCurrentDrawer(savedCurrentDrawer);
    if (savedAvailable) setAvailableToDraw(JSON.parse(savedAvailable));
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("secretSanta_participants", JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem("secretSanta_state", gameState);
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem("secretSanta_drawResults", JSON.stringify(drawResults));
  }, [drawResults]);

  useEffect(() => {
    if (currentDrawer) {
      localStorage.setItem("secretSanta_currentDrawer", currentDrawer);
    }
  }, [currentDrawer]);

  useEffect(() => {
    localStorage.setItem("secretSanta_available", JSON.stringify(availableToDraw));
  }, [availableToDraw]);

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

  const startDrawing = useCallback(() => {
    if (participants.length < 3) return false;
    
    // Pick a random first drawer
    const randomIndex = Math.floor(Math.random() * participants.length);
    const firstDrawer = participants[randomIndex];
    
    // Everyone is available to be drawn (including the first drawer, who can be drawn by others)
    // The first drawer just can't draw themselves, which is handled in performDraw
    const available = [...participants];
    
    setCurrentDrawer(firstDrawer);
    setAvailableToDraw(available);
    setDrawResults([]);
    setCurrentDrawnName(null);
    setGameState("drawing");
    
    return true;
  }, [participants]);

  const performDraw = useCallback(() => {
    if (!currentDrawer || availableToDraw.length === 0) return "";
    
    // Filter out the current drawer from available options (can't draw yourself)
    const validOptions = availableToDraw.filter(p => p !== currentDrawer);
    
    if (validOptions.length === 0) return "";
    
    // Pick a random person from valid options
    const randomIndex = Math.floor(Math.random() * validOptions.length);
    const drawn = validOptions[randomIndex];
    
    setCurrentDrawnName(drawn);
    return drawn;
  }, [currentDrawer, availableToDraw]);

  const confirmDraw = useCallback(() => {
    if (currentDrawnName && currentDrawer) {
      // Save the result
      const newResult = {
        drawer: currentDrawer,
        drawn: currentDrawnName,
      };
      
      const updatedResults = [...drawResults, newResult];
      setDrawResults(updatedResults);
      
      // Remove the drawn person from available
      const newAvailable = availableToDraw.filter(p => p !== currentDrawnName);
      setAvailableToDraw(newAvailable);
      
      // Check if this was the last draw
      if (newAvailable.length === 0) {
        // Last draw: the drawn person draws the first drawer to close the circle
        const firstDrawer = updatedResults[0].drawer;
        
        const finalResult = {
          drawer: currentDrawnName,
          drawn: firstDrawer,
        };
        setDrawResults(prev => [...prev, finalResult]);
        setGameState("finished");
      } else {
        // The DRAWN person becomes the next drawer (chain: Esther -> Emily, so Emily draws next)
        setCurrentDrawer(currentDrawnName);
      }
      
      setCurrentDrawnName(null);
    }
  }, [currentDrawnName, currentDrawer, availableToDraw, drawResults]);

  const resetGame = useCallback(() => {
    setParticipants([]);
    setGameState("home");
    setDrawResults([]);
    setCurrentDrawer(null);
    setCurrentDrawnName(null);
    setAvailableToDraw([]);
    
    localStorage.removeItem("secretSanta_participants");
    localStorage.removeItem("secretSanta_state");
    localStorage.removeItem("secretSanta_drawResults");
    localStorage.removeItem("secretSanta_currentDrawer");
    localStorage.removeItem("secretSanta_available");
  }, []);

  const cancelRound = useCallback(() => {
    setGameState("home");
    setDrawResults([]);
    setCurrentDrawer(null);
    setCurrentDrawnName(null);
    setAvailableToDraw([]);
    setParticipants([]);
    
    localStorage.removeItem("secretSanta_participants");
    localStorage.removeItem("secretSanta_state");
    localStorage.removeItem("secretSanta_drawResults");
    localStorage.removeItem("secretSanta_currentDrawer");
    localStorage.removeItem("secretSanta_available");
  }, []);

  const startGame = useCallback(() => {
    setGameState("registration");
  }, []);

  const currentDrawerIndex = drawResults.length;
  const totalParticipants = participants.length;
  // Since the current drawer is also in availableToDraw, we need to subtract 1 for valid options
  const validOptionsCount = availableToDraw.filter(p => p !== currentDrawer).length;
  const isLastDraw = validOptionsCount === 1;
  const isPenultimateDraw = validOptionsCount === 2;

  return {
    participants,
    gameState,
    drawResults,
    currentDrawerIndex,
    currentDrawnName,
    currentDrawer,
    availableToDraw,
    totalParticipants,
    isLastDraw,
    isPenultimateDraw,
    addParticipant,
    editParticipant,
    removeParticipant,
    startGame,
    startDrawing,
    performDraw,
    confirmDraw,
    resetGame,
    cancelRound,
  };
};
