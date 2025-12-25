const ChristmasDecorations = () => {
  return (
    <div className="pointer-events-none">
      {/* Top border lights */}
      <div className="fixed top-0 left-0 right-0 h-2 z-0 flex justify-around">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full animate-pulse"
            style={{
              backgroundColor: i % 3 === 0 ? 'hsl(var(--christmas-red))' : 
                              i % 3 === 1 ? 'hsl(var(--christmas-green))' : 
                              'hsl(var(--christmas-gold))',
              animationDelay: `${i * 0.2}s`,
              boxShadow: `0 0 10px ${i % 3 === 0 ? 'hsl(var(--christmas-red))' : 
                          i % 3 === 1 ? 'hsl(var(--christmas-green))' : 
                          'hsl(var(--christmas-gold))'}`,
            }}
          />
        ))}
      </div>

      {/* Corner decorations */}
      <div className="fixed top-4 left-4 text-4xl md:text-5xl opacity-70 animate-float z-0">
        🎄
      </div>
      <div className="fixed top-4 right-4 text-4xl md:text-5xl opacity-70 animate-float z-0" style={{ animationDelay: '1s' }}>
        ⭐
      </div>
      <div className="fixed bottom-4 left-4 text-3xl md:text-4xl opacity-60 z-0">
        🎁
      </div>
      <div className="fixed bottom-4 right-4 text-3xl md:text-4xl opacity-60 z-0">
        🍫
      </div>
    </div>
  );
};

export default ChristmasDecorations;
