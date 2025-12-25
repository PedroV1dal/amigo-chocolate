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
  const [drawOrder, setDrawOrder] = useState<string[]>([]); // Order of who draws (sequential)
  const [currentDrawerIndex, setCurrentDrawerIndex] = useState<number>(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedParticipants = localStorage.getItem("secretSanta_participants");
    const savedState = localStorage.getItem("secretSanta_state");
    const savedDrawResults = localStorage.getItem("secretSanta_drawResults");
    const savedCurrentDrawer = localStorage.getItem("secretSanta_currentDrawer");
    const savedAvailable = localStorage.getItem("secretSanta_available");
    const savedDrawOrder = localStorage.getItem("secretSanta_drawOrder");
    const savedDrawerIndex = localStorage.getItem("secretSanta_drawerIndex");

    if (savedParticipants) setParticipants(JSON.parse(savedParticipants));
    if (savedState) setGameState(savedState as GameState);
    if (savedDrawResults) setDrawResults(JSON.parse(savedDrawResults));
    if (savedCurrentDrawer) setCurrentDrawer(savedCurrentDrawer);
    if (savedAvailable) setAvailableToDraw(JSON.parse(savedAvailable));
    if (savedDrawOrder) setDrawOrder(JSON.parse(savedDrawOrder));
    if (savedDrawerIndex) setCurrentDrawerIndex(parseInt(savedDrawerIndex));
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

  useEffect(() => {
    localStorage.setItem("secretSanta_drawOrder", JSON.stringify(drawOrder));
  }, [drawOrder]);

  useEffect(() => {
    localStorage.setItem("secretSanta_drawerIndex", currentDrawerIndex.toString());
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

  const startDrawing = useCallback(() => {
    if (participants.length < 3) return false;
    
    // Shuffle participants to create a random draw order
    const shuffledOrder = [...participants].sort(() => Math.random() - 0.5);
    
    // First drawer is the first in the shuffled order
    const firstDrawer = shuffledOrder[0];
    
    // Everyone is available to be drawn initially
    const available = [...participants];
    
    setDrawOrder(shuffledOrder);
    setCurrentDrawerIndex(0);
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
      
      // Move to next drawer in the draw order (not who was drawn)
      const nextIndex = currentDrawerIndex + 1;
      
      // Check if we've finished all draws
      if (nextIndex >= drawOrder.length) {
        setGameState("finished");
      } else {
        // Next drawer is the next person in the shuffled order
        setCurrentDrawerIndex(nextIndex);
        setCurrentDrawer(drawOrder[nextIndex]);
      }
      
      setCurrentDrawnName(null);
    }
  }, [currentDrawnName, currentDrawer, availableToDraw, drawResults, currentDrawerIndex, drawOrder]);

  const resetGame = useCallback(() => {
    setParticipants([]);
    setGameState("home");
    setDrawResults([]);
    setCurrentDrawer(null);
    setCurrentDrawnName(null);
    setAvailableToDraw([]);
    setDrawOrder([]);
    setCurrentDrawerIndex(0);
    
    localStorage.removeItem("secretSanta_participants");
    localStorage.removeItem("secretSanta_state");
    localStorage.removeItem("secretSanta_drawResults");
    localStorage.removeItem("secretSanta_currentDrawer");
    localStorage.removeItem("secretSanta_available");
    localStorage.removeItem("secretSanta_drawOrder");
    localStorage.removeItem("secretSanta_drawerIndex");
  }, []);

  const cancelRound = useCallback(() => {
    setGameState("home");
    setDrawResults([]);
    setCurrentDrawer(null);
    setCurrentDrawnName(null);
    setAvailableToDraw([]);
    setDrawOrder([]);
    setCurrentDrawerIndex(0);
    setParticipants([]);
    
    localStorage.removeItem("secretSanta_participants");
    localStorage.removeItem("secretSanta_state");
    localStorage.removeItem("secretSanta_drawResults");
    localStorage.removeItem("secretSanta_currentDrawer");
    localStorage.removeItem("secretSanta_available");
    localStorage.removeItem("secretSanta_drawOrder");
    localStorage.removeItem("secretSanta_drawerIndex");
  }, []);

  const startGame = useCallback(() => {
    setGameState("registration");
  }, []);

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
