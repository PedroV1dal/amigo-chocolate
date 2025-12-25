import { useSecretSanta } from "@/hooks/useSecretSanta";
import SnowEffect from "@/components/SnowEffect";
import ChristmasDecorations from "@/components/ChristmasDecorations";
import HomeScreen from "@/components/HomeScreen";
import RegistrationScreen from "@/components/RegistrationScreen";
import DrawingScreen from "@/components/DrawingScreen";
import CelebrationScreen from "@/components/CelebrationScreen";

const Index = () => {
  const {
    participants,
    gameState,
    drawResults,
    currentDrawerIndex,
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
  } = useSecretSanta();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SnowEffect />
      <ChristmasDecorations />

      {gameState === "home" && (
        <HomeScreen onStart={startGame} />
      )}

      {gameState === "registration" && (
        <RegistrationScreen
          participants={participants}
          onAdd={addParticipant}
          onEdit={editParticipant}
          onDelete={removeParticipant}
          onFinalize={startDrawing}
          onCancel={cancelRound}
        />
      )}

      {gameState === "drawing" && currentDrawer && (
        <DrawingScreen
          currentDrawer={currentDrawer}
          currentDrawerIndex={currentDrawerIndex}
          totalParticipants={totalParticipants}
          availableToDraw={availableToDraw}
          isLastDraw={isLastDraw}
          isPenultimateDraw={isPenultimateDraw}
          onDraw={performDraw}
          onConfirm={confirmDraw}
          onCancel={cancelRound}
        />
      )}

      {gameState === "finished" && (
        <CelebrationScreen
          results={drawResults}
          onReset={resetGame}
        />
      )}
    </div>
  );
};

export default Index;
