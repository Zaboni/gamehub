'use client';

import { useEffect, useState, useCallback } from 'react';

interface Puzzle {
  type: string;
  instruction: string;
  detail: string;
  grid: (string | number)[];
  answer: (string | number)[];
  gridSize: { cols: number; rows: number };
  options: (string | number)[];
}

const puzzles: Puzzle[] = [
  {
    type: 'number_sequence',
    instruction: "Complete the number sequence",
    detail: "Find the missing number in the pattern",
    grid: [2, 4, 6, '?', 10, 12],
    answer: [8],
    gridSize: { cols: 6, rows: 1 },
    options: [7, 8, 9, 10]
  },
  {
    type: 'pattern_matching',
    instruction: "Find the matching pattern",
    detail: "Select the tile that completes the pattern",
    grid: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'],
    answer: ['🔵'],
    gridSize: { cols: 6, rows: 1 },
    options: ['🔴', '🔵', '🟡', '🟢']
  },
  {
    type: 'math_puzzle',
    instruction: "Solve the equation",
    detail: "Find the missing number to complete the equation",
    grid: [3, '+', 5, '=', '?'],
    answer: [8],
    gridSize: { cols: 5, rows: 1 },
    options: [6, 7, 8, 9]
  },
  {
    type: 'color_sequence',
    instruction: "Complete the color pattern",
    detail: "What color comes next in the sequence?",
    grid: ['🟥', '🟦', '🟥', '🟦', '🟥', '?'],
    answer: ['🟦'],
    gridSize: { cols: 6, rows: 1 },
    options: ['🟥', '🟦', '🟨', '🟩']
  },
  {
    type: 'logic_grid',
    instruction: "Complete the logic grid",
    detail: "Find the pattern in rows and columns",
    grid: [
      '⭐', '⭐', '🌙',
      '🌙', '⭐', '⭐',
      '⭐', '?', '🌙'
    ],
    answer: ['🌙'],
    gridSize: { cols: 3, rows: 3 },
    options: ['⭐', '🌙', '☀️', '🌟']
  },
  {
    type: 'number_sequence',
    instruction: "Find the pattern in the sequence",
    detail: "Each number follows a mathematical rule",
    grid: [1, 4, 9, 16, '?', 36],
    answer: [25],
    gridSize: { cols: 6, rows: 1 },
    options: [20, 23, 25, 28]
  },
  {
    type: 'pattern_matching',
    instruction: "Identify the complex pattern",
    detail: "Look for the repeating sequence",
    grid: ['A', 'B', 'C', 'A', 'B', 'C', 'A', '?'],
    answer: ['B'],
    gridSize: { cols: 8, rows: 1 },
    options: ['A', 'B', 'C', 'D']
  },
  {
    type: 'math_puzzle',
    instruction: "Solve the mathematical pattern",
    detail: "Find the rule connecting the numbers",
    grid: [2, 6, 18, '?', 162],
    answer: [54],
    gridSize: { cols: 5, rows: 1 },
    options: [48, 54, 60, 66]
  }
];

export default function PuzzleMasterGame() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedTiles, setSelectedTiles] = useState<Record<number, string | number>>({});
  const [hintsUsed, setHintsUsed] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [tileStates, setTileStates] = useState<Record<number, 'selected' | 'correct' | 'incorrect'>>({});

  const currentPuzzle = puzzles[currentLevel - 1];

  const updateTimer = useCallback(() => {
    setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
  }, [startTime]);

  useEffect(() => {
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [updateTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectOption = (tileIndex: number, option: string | number) => {
    setSelectedTiles(prev => ({ ...prev, [tileIndex]: option }));
    setTileStates(prev => ({ ...prev, [tileIndex]: 'selected' }));
    setMoves(prev => prev + 1);
    setShowOptions(null);
  };

  const checkAnswer = () => {
    if (Object.keys(selectedTiles).length === 0) {
      alert('Please select an answer first!');
      return;
    }

    let correct = true;
    const newTileStates: Record<number, 'selected' | 'correct' | 'incorrect'> = {};

    currentPuzzle.grid.forEach((item, index) => {
      if (item === '?' && selectedTiles[index] !== undefined) {
        if (currentPuzzle.answer.includes(selectedTiles[index])) {
          newTileStates[index] = 'correct';
        } else {
          newTileStates[index] = 'incorrect';
          correct = false;
        }
      }
    });

    setTileStates(newTileStates);

    if (correct) {
      const baseScore = currentLevel * 100;
      const moveBonus = Math.max(0, 50 - moves * 5);
      const hintPenalty = hintsUsed * 20;
      const levelScore = Math.max(baseScore + moveBonus - hintPenalty, 10);
      
      setScore(prev => prev + levelScore);
      
      setTimeout(() => {
        alert(`Correct! +${levelScore} points`);
        if (currentLevel >= puzzles.length) {
          setGameComplete(true);
        }
      }, 500);
    } else {
      alert('Not quite right. Try again!');
      setTimeout(() => {
        const resetStates: Record<number, 'selected' | 'correct' | 'incorrect'> = {};
        Object.keys(newTileStates).forEach(key => {
          const index = parseInt(key);
          if (newTileStates[index] === 'incorrect') {
            setSelectedTiles(prev => {
              const updated = { ...prev };
              delete updated[index];
              return updated;
            });
          } else {
            resetStates[index] = newTileStates[index];
          }
        });
        setTileStates(resetStates);
      }, 1000);
    }
  };

  const showHint = () => {
    let hintText = '';
    
    switch (currentPuzzle.type) {
      case 'number_sequence':
        if (currentLevel === 1) {
          hintText = 'The numbers increase by 2 each time';
        } else if (currentLevel === 6) {
          hintText = 'These are perfect squares: 1², 2², 3², 4², ?², 6²';
        } else if (currentLevel === 8) {
          hintText = 'Each number is multiplied by 3';
        }
        break;
      case 'pattern_matching':
        hintText = 'Look for the repeating pattern in the sequence';
        break;
      case 'math_puzzle':
        if (currentLevel === 3) {
          hintText = 'Simple addition: 3 + 5 = ?';
        }
        break;
      case 'color_sequence':
        hintText = 'The colors alternate in a simple pattern';
        break;
      case 'logic_grid':
        hintText = 'Each row and column should have the same number of each symbol';
        break;
    }
    
    if (hintText) {
      alert('Hint: ' + hintText);
      setHintsUsed(prev => prev + 1);
    }
  };

  const nextLevel = () => {
    if (currentLevel < puzzles.length) {
      setCurrentLevel(prev => prev + 1);
      setSelectedTiles({});
      setTileStates({});
      setMoves(0);
      setHintsUsed(0);
    }
  };

  const restartGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setMoves(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setSelectedTiles({});
    setTileStates({});
    setHintsUsed(0);
    setGameComplete(false);
  };

  const getTileClassName = (index: number, item: string | number) => {
    const baseClass = "bg-white border-none rounded-md text-lg font-bold cursor-pointer transition-all duration-200 flex items-center justify-center min-h-12 hover:bg-blue-50 hover:scale-105";
    
    if (item === '?') {
      const state = tileStates[index];
      if (state === 'selected') return `${baseClass} bg-blue-500 text-white`;
      if (state === 'correct') return `${baseClass} bg-green-500 text-white`;
      if (state === 'incorrect') return `${baseClass} bg-red-500 text-white`;
      return `${baseClass} bg-gray-100`;
    }
    
    return baseClass;
  };

  const getTileContent = (index: number, item: string | number) => {
    if (item === '?' && selectedTiles[index] !== undefined) {
      return selectedTiles[index];
    }
    return item;
  };

  const allCorrect = currentPuzzle.grid.every((item, index) => {
    if (item === '?') {
      return tileStates[index] === 'correct';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🧩 Puzzle Master</h1>
        </div>

        {/* Stats */}
        <div className="flex justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-600">Level</div>
            <div className="text-xl font-bold text-gray-800">{currentLevel}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-xl font-bold text-gray-800">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Time</div>
            <div className="text-xl font-bold text-orange-500">{formatTime(elapsedTime)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Moves</div>
            <div className="text-xl font-bold text-gray-800">{moves}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
          <div className="text-blue-800 font-bold mb-1">{currentPuzzle.instruction}</div>
          <div className="text-gray-600 text-sm">{currentPuzzle.detail}</div>
        </div>

        {/* Puzzle Grid */}
        <div 
          className="grid gap-2 bg-gray-800 rounded-lg p-4 mb-6 mx-auto max-w-md"
          style={{ 
            gridTemplateColumns: `repeat(${currentPuzzle.gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${currentPuzzle.gridSize.rows}, 1fr)`
          }}
        >
          {currentPuzzle.grid.map((item, index) => (
            <div
              key={index}
              className={getTileClassName(index, item)}
              onClick={() => item === '?' ? setShowOptions(index) : null}
            >
              {getTileContent(index, item)}
            </div>
          ))}
        </div>

        {/* Options Modal */}
        {showOptions !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-bold mb-4 text-center">Choose an option:</h3>
              <div className="grid grid-cols-2 gap-3">
                {currentPuzzle.options.map((option, index) => (
                  <button
                    key={index}
                    className="bg-gray-100 hover:bg-blue-100 p-3 rounded-lg text-lg font-bold transition-colors duration-200"
                    onClick={() => selectOption(showOptions, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors duration-200"
                onClick={() => setShowOptions(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="text-center space-x-4">
          {!allCorrect ? (
            <>
              <button
                onClick={checkAnswer}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                disabled={Object.keys(selectedTiles).length === 0}
              >
                Check Answer
              </button>
              <button
                onClick={showHint}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                disabled={hintsUsed > 0}
              >
                Hint
              </button>
            </>
          ) : (
            <button
              onClick={nextLevel}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Next Level
            </button>
          )}
          <button
            onClick={restartGame}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Restart
          </button>
        </div>

        {/* Game Complete Modal */}
        {gameComplete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
              <div className="text-3xl font-bold text-green-500 mb-4">🎉 Congratulations!</div>
              <div className="mb-6">
                <div className="text-lg mb-2">You completed all levels!</div>
                <div className="text-lg mb-2">Final Score: <span className="font-bold">{score}</span></div>
                <div className="text-lg">Total Time: <span className="font-bold">{formatTime(elapsedTime)}</span></div>
              </div>
              <button
                onClick={restartGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}