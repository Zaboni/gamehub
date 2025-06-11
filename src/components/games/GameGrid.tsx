'use client';

import { useState, useEffect } from 'react';
import { GameCard } from './GameCard';
import { Game } from '@/lib/types/game';

// Mock data - replace with actual API call
const mockGames: Game[] = [
  {
    id: 'puzzle-master',
    title: 'Puzzle Master',
    description: 'A challenging puzzle game that tests your logic and problem-solving skills.',
    shortDescription: 'Test your logic with challenging puzzles',
    author: 'PuzzleDev',
    authorGithub: 'puzzledev',
    category: 'Puzzle',
    tags: ['puzzle', 'logic', 'brain-teaser'],
    difficulty: 'Medium',
    thumbnail: '/games/puzzle-master/thumbnail.png',
    screenshots: ['/games/puzzle-master/screenshot1.png'],
    playUrl: '/games/puzzle-master/index.html',
    sourceUrl: 'https://github.com/puzzledev/puzzle-master',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    featured: true,
    playCount: 1250,
    rating: 4.5,
    ratingCount: 23,
    status: 'active',
    requirements: {
      browser: ['Chrome', 'Firefox', 'Safari'],
      mobile: true,
      keyboard: true,
      mouse: true,
    },
  },
  {
    id: 'space-runner',
    title: 'Space Runner',
    description: 'An endless runner game set in space with amazing graphics and smooth gameplay.',
    shortDescription: 'Endless running action in space',
    author: 'SpaceGamer',
    authorGithub: 'spacegamer',
    category: 'Action',
    tags: ['action', 'runner', 'space', 'endless'],
    difficulty: 'Easy',
    thumbnail: '/games/space-runner/thumbnail.png',
    screenshots: ['/games/space-runner/screenshot1.png'],
    playUrl: '/games/space-runner/index.html',
    sourceUrl: 'https://github.com/spacegamer/space-runner',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    featured: false,
    playCount: 890,
    rating: 4.2,
    ratingCount: 15,
    status: 'active',
    requirements: {
      browser: ['Chrome', 'Firefox'],
      mobile: false,
      keyboard: true,
    },
  },
  {
    id: 'memory-cards',
    title: 'Memory Cards',
    description: 'Classic memory card matching game with beautiful themes and difficulty levels.',
    shortDescription: 'Match cards and test your memory',
    author: 'MemoryMaster',
    authorGithub: 'memorymaster',
    category: 'Casual',
    tags: ['memory', 'cards', 'matching', 'casual'],
    difficulty: 'Easy',
    thumbnail: '/games/memory-cards/thumbnail.png',
    screenshots: ['/games/memory-cards/screenshot1.png'],
    playUrl: '/games/memory-cards/index.html',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
    featured: true,
    playCount: 2100,
    rating: 4.8,
    ratingCount: 42,
    status: 'active',
    requirements: {
      browser: ['Chrome', 'Firefox', 'Safari', 'Edge'],
      mobile: true,
      mouse: true,
      touch: true,
    },
  },
  {
    id: 'strategy-conquest',
    title: 'Strategy Conquest',
    description: 'A turn-based strategy game where you build armies and conquer territories.',
    shortDescription: 'Build armies and conquer territories',
    author: 'StrategyPro',
    authorGithub: 'strategypro',
    category: 'Strategy',
    tags: ['strategy', 'turn-based', 'conquest', 'tactical'],
    difficulty: 'Hard',
    thumbnail: '/games/strategy-conquest/thumbnail.png',
    screenshots: ['/games/strategy-conquest/screenshot1.png'],
    playUrl: '/games/strategy-conquest/index.html',
    sourceUrl: 'https://github.com/strategypro/strategy-conquest',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    featured: false,
    playCount: 650,
    rating: 4.3,
    ratingCount: 18,
    status: 'active',
    requirements: {
      browser: ['Chrome', 'Firefox', 'Safari'],
      mobile: false,
      keyboard: true,
      mouse: true,
    },
  },
];

interface GameGridProps {
  className?: string;
}

export function GameGrid({ className }: GameGridProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadGames = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setGames(mockGames);
      setLoading(false);
    };

    loadGames();
  }, []);

  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-secondary-200 rounded-xl h-48 mb-4"></div>
              <div className="bg-secondary-200 rounded h-4 mb-2"></div>
              <div className="bg-secondary-200 rounded h-3 w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className={className}>
        <div className="text-center py-12">
          <div className="text-secondary-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No games found</h3>
          <p className="text-secondary-600">Try adjusting your filters or search terms.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}