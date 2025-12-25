import { useState, useEffect, useCallback } from "react";

export type GameState = "home" | "registration" | "drawing" | "finished";

interface DrawResult {
  drawer: string;
  drawn: string;
}

// Fisher-Yates shuffle algorithm (proper random shuffle)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to create a random circular chain
// Each person draws the next in the shuffled array, last draws first (circular)
const createRandomCircularChain = (participants: string[]): DrawResult[] => {
  // Shuffle participants using Fisher-Yates (proper random shuffle)
  const shuffled = shuffleArray(participants);

  // Create chain: each person draws the next, last person draws first (closes circle)
  const chain: DrawResult[] = [];
  for (let i = 0; i < shuffled.length; i++) {
    const drawer = shuffled[i];
    const drawn = shuffled[(i + 1) % shuffled.length]; // % makes it circular
    chain.push({ drawer, drawn });
  }

  return chain;
};

export const useSecretSanta = () => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>("home");
  const [drawResults, setDrawResults] = useState<DrawResult[]>([]);
  const [currentDrawer, setCurrentDrawer] = useState<string | null>(null);
  const [currentDrawnName, setCurrentDrawnName] = useState<string | null>(null);
  const [drawChain, setDrawChain] = useState<DrawResult[]>([]); // Pre-defined circular chain
  const [availableToDraw, setAvailableToDraw] = useState<string[]>([]); // Kept for slot machine display
  const [drawOrder, setDrawOrder] = useState<string[]>([]); // Deprecated but kept for compatibility
  const [currentDrawerIndex, setCurrentDrawerIndex] = useState<number>(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedParticipants = localStorage.getItem("secretSanta_participants");
    const savedState = localStorage.getItem("secretSanta_state");
    const savedDrawResults = localStorage.getItem("secretSanta_drawResults");
    const savedCurrentDrawer = localStorage.getItem("secretSanta_currentDrawer");
    const savedDrawChain = localStorage.getItem("secretSanta_drawChain");
    const savedAvailable = localStorage.getItem("secretSanta_available");
    const savedDrawOrder = localStorage.getItem("secretSanta_drawOrder");
    const savedDrawerIndex = localStorage.getItem("secretSanta_drawerIndex");

    if (savedParticipants) setParticipants(JSON.parse(savedParticipants));
    if (savedState) setGameState(savedState as GameState);
    if (savedDrawResults) setDrawResults(JSON.parse(savedDrawResults));
    if (savedCurrentDrawer) setCurrentDrawer(savedCurrentDrawer);
    if (savedDrawChain) setDrawChain(JSON.parse(savedDrawChain));
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

  useEffect(() => {
    localStorage.setItem("secretSanta_drawChain", JSON.stringify(drawChain));
  }, [drawChain]);

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

    // Create a random circular chain where each person draws the next
    // The shuffle inside createRandomCircularChain provides randomness
    // Example: Ana→Bruno, Bruno→Diana, Diana→Carlos, Carlos→Ana (closes circle)
    const chain = createRandomCircularChain(participants);

    // Don't reorder! The shuffle already makes it random
    // If we reorder, the first drawer always becomes the winner (last drawn)
    const firstDrawer = chain[0].drawer;

    setDrawChain(chain);
    setCurrentDrawerIndex(0);
    setCurrentDrawer(firstDrawer);
    setAvailableToDraw([...participants]); // For slot machine display only
    setDrawOrder([]); // Not used anymore but kept for compatibility
    setDrawResults([]);
    setCurrentDrawnName(null);
    setGameState("drawing");

    return true;
  }, [participants]);

  const performDraw = useCallback(() => {
    if (!currentDrawer || drawChain.length === 0) return "";

    // Get the pre-defined person to draw from the chain
    const currentPair = drawChain[currentDrawerIndex];

    if (!currentPair || currentPair.drawer !== currentDrawer) {
      console.error("Chain inconsistency! Expected drawer:", currentDrawer, "but got:", currentPair?.drawer);
      return "";
    }

    const drawn = currentPair.drawn;
    setCurrentDrawnName(drawn);
    return drawn;
  }, [currentDrawer, drawChain, currentDrawerIndex]);

  const confirmDraw = useCallback(() => {
    if (currentDrawnName && currentDrawer) {
      // Save the result
      const newResult = {
        drawer: currentDrawer,
        drawn: currentDrawnName,
      };

      const updatedResults = [...drawResults, newResult];
      setDrawResults(updatedResults);

      // Move to next in the chain
      const nextIndex = currentDrawerIndex + 1;
      setCurrentDrawerIndex(nextIndex);

      // Check if we've finished all draws in the chain
      if (nextIndex >= drawChain.length) {
        setGameState("finished");
      } else {
        // Next drawer is the next person in the circular chain
        // In circular chain, next drawer is who was just drawn!
        setCurrentDrawer(drawChain[nextIndex].drawer);
      }

      setCurrentDrawnName(null);
    }
  }, [currentDrawnName, currentDrawer, drawResults, currentDrawerIndex, drawChain]);

  const resetGame = useCallback(() => {
    setParticipants([]);
    setGameState("home");
    setDrawResults([]);
    setCurrentDrawer(null);
    setCurrentDrawnName(null);
    setDrawChain([]);
    setAvailableToDraw([]);
    setDrawOrder([]);
    setCurrentDrawerIndex(0);

    localStorage.removeItem("secretSanta_participants");
    localStorage.removeItem("secretSanta_state");
    localStorage.removeItem("secretSanta_drawResults");
    localStorage.removeItem("secretSanta_currentDrawer");
    localStorage.removeItem("secretSanta_drawChain");
    localStorage.removeItem("secretSanta_available");
    localStorage.removeItem("secretSanta_drawOrder");
    localStorage.removeItem("secretSanta_drawerIndex");
  }, []);

  const cancelRound = useCallback(() => {
    setGameState("home");
    setDrawResults([]);
    setCurrentDrawer(null);
    setCurrentDrawnName(null);
    setDrawChain([]);
    setAvailableToDraw([]);
    setDrawOrder([]);
    setCurrentDrawerIndex(0);
    setParticipants([]);

    localStorage.removeItem("secretSanta_participants");
    localStorage.removeItem("secretSanta_state");
    localStorage.removeItem("secretSanta_drawResults");
    localStorage.removeItem("secretSanta_currentDrawer");
    localStorage.removeItem("secretSanta_drawChain");
    localStorage.removeItem("secretSanta_available");
    localStorage.removeItem("secretSanta_drawOrder");
    localStorage.removeItem("secretSanta_drawerIndex");
  }, []);

  const startGame = useCallback(() => {
    setGameState("registration");
  }, []);

  const totalParticipants = participants.length;
  // Check if current draw is the last one in the chain
  const isLastDraw = drawChain.length > 0 && currentDrawerIndex === drawChain.length - 1;
  const isPenultimateDraw = drawChain.length > 0 && currentDrawerIndex === drawChain.length - 2;

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
