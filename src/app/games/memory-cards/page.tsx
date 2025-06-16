'use client';

import { useEffect, useState, useCallback } from 'react';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎺', '🎸', '🎹', '🎤', '🎧', '🎬', '🚀', '⭐', '🌟', '💎', '🔥', '⚡', '🌈', '🦄', '🎈', '🎁', '🏆', '👑', '💫', '✨'];

export default function MemoryCardsGame() {
  const [gridSize, setGridSize] = useState(6);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const createBoard = useCallback(() => {
    const totalCards = gridSize * gridSize;
    const pairs = totalCards / 2;
    
    const gameSymbols: string[] = [];
    for (let i = 0; i < pairs; i++) {
      const symbol = symbols[i % symbols.length];
      gameSymbols.push(symbol, symbol);
    }
    
    const shuffledSymbols = shuffleArray(gameSymbols);
    
    const newCards: Card[] = shuffledSymbols.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));
    
    setCards(newCards);
  }, [gridSize]);

  const initializeGame = useCallback(() => {
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setStartTime(null);
    setGameStarted(false);
    setIsPaused(false);
    setGameComplete(false);
    setElapsedTime(0);
    createBoard();
  }, [createBoard]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setStartTime(Date.now());
  }, []);

  const updateTimer = useCallback(() => {
    if (startTime && !isPaused && !gameComplete) {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }
  }, [startTime, isPaused, gameComplete]);

  useEffect(() => {
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [updateTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const flipCard = (cardId: number) => {
    if (isPaused || gameComplete) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }

    if (!gameStarted) {
      startGame();
    }

    const updatedCard = { ...card, isFlipped: true };
    const newFlippedCards = [...flippedCards, updatedCard];
    
    setCards(prev => prev.map(c => c.id === cardId ? updatedCard : c));
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      checkMatch(newFlippedCards);
    }
  };

  const checkMatch = (flippedCards: Card[]) => {
    const [card1, card2] = flippedCards;
    
    setTimeout(() => {
      if (card1.symbol === card2.symbol) {
        // Match found
        setCards(prev => prev.map(c => 
          c.id === card1.id || c.id === card2.id 
            ? { ...c, isMatched: true }
            : c
        ));
        setMatchedPairs(prev => prev + 1);
        
        if (matchedPairs + 1 === (gridSize * gridSize) / 2) {
          setGameComplete(true);
        }
      } else {
        // No match
        setCards(prev => prev.map(c => 
          c.id === card1.id || c.id === card2.id 
            ? { ...c, isFlipped: false }
            : c
        ));
      }
      
      setFlippedCards([]);
    }, 1000);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const showHint = () => {
    if (isPaused || !gameStarted || gameComplete) return;
    
    const unmatched = cards.filter(card => !card.isMatched && !card.isFlipped);
    if (unmatched.length < 2) return;
    
    // Find a matching pair
    for (let i = 0; i < unmatched.length; i++) {
      for (let j = i + 1; j < unmatched.length; j++) {
        if (unmatched[i].symbol === unmatched[j].symbol) {
          // Highlight the matching pair briefly
          const hintCards = [unmatched[i], unmatched[j]];
          
          setCards(prev => prev.map(c => 
            hintCards.some(hc => hc.id === c.id)
              ? { ...c, isFlipped: true }
              : c
          ));
          
          setTimeout(() => {
            setCards(prev => prev.map(c => 
              hintCards.some(hc => hc.id === c.id)
                ? { ...c, isFlipped: false }
                : c
            ));
          }, 2000);
          
          setMoves(prev => prev + 2); // Penalty for using hint
          return;
        }
      }
    }
  };

  const changeDifficulty = (newSize: number) => {
    setGridSize(newSize);
  };

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const getCardClassName = (card: Card) => {
    let className = "w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg";
    
    if (card.isFlipped || card.isMatched) {
      className += " bg-gradient-to-br from-blue-100 to-blue-200";
    }
    
    if (card.isMatched) {
      className += " bg-gradient-to-br from-green-400 to-green-500 scale-95";
    }
    
    return className;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center p-4 text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">🃏 Memory Cards</h1>
        <div className="flex gap-8 justify-center mb-4 flex-wrap">
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3 border border-white/30">
            <div className="text-sm opacity-80">Time</div>
            <div className="text-xl font-bold">{formatTime(elapsedTime)}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3 border border-white/30">
            <div className="text-sm opacity-80">Moves</div>
            <div className="text-xl font-bold">{moves}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3 border border-white/30">
            <div className="text-sm opacity-80">Matches</div>
            <div className="text-xl font-bold">{matchedPairs}</div>
          </div>
        </div>
      </div>

      {/* Difficulty Selector */}
      <div className="mb-6">
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            className={`px-5 py-2 rounded-full border border-white/30 backdrop-blur-lg transition-all duration-300 ${
              gridSize === 4 ? 'bg-white/40 shadow-lg' : 'bg-white/20 hover:bg-white/30'
            }`}
            onClick={() => changeDifficulty(4)}
          >
            Easy (4x4)
          </button>
          <button
            className={`px-5 py-2 rounded-full border border-white/30 backdrop-blur-lg transition-all duration-300 ${
              gridSize === 6 ? 'bg-white/40 shadow-lg' : 'bg-white/20 hover:bg-white/30'
            }`}
            onClick={() => changeDifficulty(6)}
          >
            Medium (6x6)
          </button>
          <button
            className={`px-5 py-2 rounded-full border border-white/30 backdrop-blur-lg transition-all duration-300 ${
              gridSize === 8 ? 'bg-white/40 shadow-lg' : 'bg-white/20 hover:bg-white/30'
            }`}
            onClick={() => changeDifficulty(8)}
          >
            Hard (8x8)
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div className="mb-6">
        <div 
          className="grid gap-3 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            maxWidth: '600px'
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className={getCardClassName(card)}
              onClick={() => flipCard(card.id)}
              style={{
                opacity: isPaused ? 0.5 : 1,
                pointerEvents: isPaused ? 'none' : 'auto'
              }}
            >
              <div className="text-2xl">
                {card.isFlipped || card.isMatched ? card.symbol : '?'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={initializeGame}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
        >
          New Game
        </button>
        <button
          onClick={togglePause}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={showHint}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
          disabled={!gameStarted || isPaused || gameComplete}
        >
          Hint
        </button>
      </div>

      {/* Game Complete Modal */}
      {gameComplete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl text-center shadow-2xl border border-white/20">
            <h2 className="text-3xl font-bold text-yellow-300 mb-6">🎉 Congratulations!</h2>
            <p className="text-lg mb-6">
              You completed the game in {formatTime(elapsedTime)} with {moves} moves!<br />
              <small className="text-sm opacity-80">Difficulty: {gridSize}x{gridSize}</small>
            </p>
            <button
              onClick={initializeGame}
              className="px-8 py-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}