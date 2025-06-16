'use client';

import { useEffect, useState, useCallback } from 'react';

type Player = 'X' | 'O';
type GameMode = 'pvp' | 'ai';
type CellValue = Player | '';

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
}

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

export default function TicTacToeGame() {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [gameActive, setGameActive] = useState(true);
  const [stats, setStats] = useState<GameStats>({ xWins: 0, oWins: 0, draws: 0 });
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);

  // Load stats from localStorage on component mount
  useEffect(() => {
    const savedStats = localStorage.getItem('ticTacToeStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save stats to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem('ticTacToeStats', JSON.stringify(stats));
  }, [stats]);

  const checkWinnerForBoard = useCallback((board: CellValue[]): Player | null => {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as Player;
      }
    }
    return null;
  }, []);

  const minimax = useCallback((board: CellValue[], depth: number, isMaximizing: boolean): number => {
    const winner = checkWinnerForBoard(board);
    
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }, [checkWinnerForBoard]);

  const getBestMove = useCallback((board: CellValue[]): number => {
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, 0, false);
        board[i] = '';
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }, [minimax]);

  const endGame = useCallback((result: Player | 'draw') => {
    setGameActive(false);
    setWinner(result);
    
    if (result !== 'draw') {
      // Find and highlight winning combination
      for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          setWinningCells(combination);
          break;
        }
      }
    }

    // Update stats
    setStats(prev => {
      const newStats = { ...prev };
      if (result === 'X') {
        newStats.xWins++;
      } else if (result === 'O') {
        newStats.oWins++;
      } else {
        newStats.draws++;
      }
      return newStats;
    });

    // Show game over modal after a delay
    setTimeout(() => {
      setGameOver(true);
    }, 1000);
  }, [board]);

  const makeMove = useCallback((index: number, player: Player) => {
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const winner = checkWinnerForBoard(newBoard);
    if (winner) {
      endGame(winner);
    } else if (newBoard.every(cell => cell !== '')) {
      endGame('draw');
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  }, [board, currentPlayer, checkWinnerForBoard, endGame]);

  const makeAIMove = useCallback(() => {
    if (!gameActive) return;

    const bestMove = getBestMove([...board]);
    makeMove(bestMove, 'O');
  }, [gameActive, getBestMove, board, makeMove]);

  const handleCellClick = (index: number) => {
    if (!gameActive || board[index] !== '') {
      return;
    }

    makeMove(index, currentPlayer);
    
    if (gameActive && gameMode === 'ai' && currentPlayer === 'X') {
      setTimeout(() => makeAIMove(), 500);
    }
  };

  const changeGameMode = (newMode: GameMode) => {
    setGameMode(newMode);
    newGame();
  };

  const newGame = () => {
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setGameActive(true);
    setWinningCells([]);
    setGameOver(false);
    setWinner(null);
  };

  const resetStats = () => {
    setStats({ xWins: 0, oWins: 0, draws: 0 });
  };

  const getCellClassName = (index: number) => {
    let className = "bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 text-4xl font-bold text-gray-800 hover:scale-105 hover:shadow-lg";
    
    if (board[index] === 'X') {
      className += " bg-gradient-to-br from-red-100 to-red-200 text-red-600";
    } else if (board[index] === 'O') {
      className += " bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600";
    }
    
    if (winningCells.includes(index)) {
      className += " bg-gradient-to-br from-green-400 to-green-500 text-white animate-pulse";
    }
    
    return className;
  };

  const getCurrentPlayerDisplay = () => {
    if (gameMode === 'ai') {
      if (currentPlayer === 'X') {
        return "Your Turn (X)";
      } else {
        return "AI's Turn (O)";
      }
    } else {
      return `Player ${currentPlayer}'s Turn`;
    }
  };

  const getGameOverMessage = () => {
    if (winner === 'draw') {
      return "🤝 It's a Draw!";
    } else {
      return `🎉 Player ${winner} Wins!`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center p-4 text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">⭕ Tic Tac Toe</h1>
        <div className="flex gap-8 justify-center mb-4 flex-wrap">
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3 border border-white/30">
            <div className="text-sm opacity-80">X Wins</div>
            <div className="text-xl font-bold">{stats.xWins}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3 border border-white/30">
            <div className="text-sm opacity-80">O Wins</div>
            <div className="text-xl font-bold">{stats.oWins}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-lg p-3 border border-white/30">
            <div className="text-sm opacity-80">Draws</div>
            <div className="text-xl font-bold">{stats.draws}</div>
          </div>
        </div>
      </div>

      {/* Game Mode Selector */}
      <div className="mb-6">
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            className={`px-5 py-2 rounded-full border border-white/30 backdrop-blur-lg transition-all duration-300 ${
              gameMode === 'pvp' ? 'bg-white/40 shadow-lg' : 'bg-white/20 hover:bg-white/30'
            }`}
            onClick={() => changeGameMode('pvp')}
          >
            Player vs Player
          </button>
          <button
            className={`px-5 py-2 rounded-full border border-white/30 backdrop-blur-lg transition-all duration-300 ${
              gameMode === 'ai' ? 'bg-white/40 shadow-lg' : 'bg-white/20 hover:bg-white/30'
            }`}
            onClick={() => changeGameMode('ai')}
          >
            Player vs AI
          </button>
        </div>
      </div>

      {/* Current Player Display */}
      <div className={`text-xl mb-6 text-center bg-white/20 backdrop-blur-lg rounded-full px-8 py-3 border border-white/30 ${
        currentPlayer === 'X' ? 'text-red-300' : 'text-blue-300'
      }`}>
        {getCurrentPlayerDisplay()}
      </div>

      {/* Game Board */}
      <div className="mb-6">
        <div className="grid grid-cols-3 grid-rows-3 gap-2 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 w-80 h-80">
          {board.map((cell, index) => (
            <div
              key={index}
              className={getCellClassName(index)}
              onClick={() => handleCellClick(index)}
            >
              {cell}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={newGame}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
        >
          New Game
        </button>
        <button
          onClick={resetStats}
          className="px-6 py-3 bg-white/20 backdrop-blur-lg rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300"
        >
          Reset Stats
        </button>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl text-center shadow-2xl border border-white/20">
            <h2 className="text-3xl font-bold text-yellow-300 mb-6">{getGameOverMessage()}</h2>
            <p className="text-lg mb-6">
              {winner === 'draw' ? 'Nobody wins this round!' : 
               winner === 'X' ? <span className="text-red-300">Player X</span> : 
               <span className="text-blue-300">Player O</span>} 
              {winner !== 'draw' && ' is the winner!'}
            </p>
            <button
              onClick={() => {
                setGameOver(false);
                newGame();
              }}
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