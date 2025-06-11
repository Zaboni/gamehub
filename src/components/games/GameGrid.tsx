'use client';

import { useState, useEffect } from 'react';
import { GameCard } from './GameCard';
import { Game } from '@/lib/types/game';

// Mock data - replace with actual API call
const mockGames: Game[] = [
  {
    id: 'space-defender',
    title: 'Space Defender',
    description: 'An exciting space-themed action game where you pilot a spaceship through a dangerous asteroid field. Collect power-ups and coins while avoiding deadly asteroids. The game features smooth controls, particle effects, and progressively increasing difficulty. Test your reflexes and see how high you can score in this endless space adventure!',
    shortDescription: 'Pilot your spaceship, collect power-ups, and avoid asteroids in this thrilling space adventure',
    author: 'Aldo',
    authorGithub: 'Zaboni',
    category: 'Action',
    tags: ['action', 'space', 'arcade', 'endless', 'shooter', 'survival'],
    difficulty: 'Medium',
    thumbnail: '/games/space-defender/thumbnail.png',
    screenshots: ['/games/space-defender/screenshot1.png'],
    playUrl: '/games/space-defender/index.html',
    createdAt: '2025-06-10',
    updatedAt: '2025-06-10',
    featured: true,
    playCount: 0,
    rating: 5.0,
    ratingCount: 1,
    status: 'active',
    requirements: {
      browser: ['Chrome', 'Firefox', 'Safari', 'Edge'],
      mobile: false,
      keyboard: true,
      mouse: false,
    },
  },
  {
    id: 'puzzle-master',
    title: 'Puzzle Master',
    description: 'A challenging logic and brain-teaser game that tests your problem-solving skills with increasingly difficult puzzles. Features 8 progressive levels with number sequences, pattern matching, math puzzles, color sequences, and logic grids. Each level increases in difficulty and includes a scoring system based on efficiency and hints used.',
    shortDescription: 'Test your logic with challenging puzzles across 8 progressive levels',
    author: 'Dr.',
    authorGithub: 'zona',
    category: 'Puzzle',
    tags: ['puzzle', 'logic', 'brain-teaser', 'math', 'patterns'],
    difficulty: 'Medium',
    thumbnail: '/games/puzzle-master/thumbnail.png',
    screenshots: ['/games/puzzle-master/screenshot1.png'],
    playUrl: '/games/puzzle-master/index.html',
    createdAt: '2025-06-10',
    updatedAt: '2025-06-10',
    featured: true,
    playCount: 0,
    rating: 5.0,
    ratingCount: 1,
    status: 'active',
    requirements: {
      browser: ['Chrome', 'Firefox', 'Safari', 'Edge'],
      mobile: true,
      keyboard: true,
      mouse: true,
    },
  },
  {
    id: 'space-runner',
    title: 'Space Runner',
    description: 'An endless runner game set in space with amazing graphics and smooth gameplay! Navigate through asteroids, collect stars, and see how far you can go! Features physics-based movement, particle effects, progressive difficulty, and real-time stats tracking. Control your cyan spaceship through the endless void of space.',
    shortDescription: 'Navigate through space, collect stars, and avoid asteroids in this endless runner',
    author: 'Dr.',
    authorGithub: 'zona',
    category: 'Action',
    tags: ['action', 'runner', 'space', 'endless', 'arcade', 'physics'],
    difficulty: 'Easy',
    thumbnail: '/games/space-runner/thumbnail.png',
    screenshots: ['/games/space-runner/screenshot1.png'],
    playUrl: '/games/space-runner/index.html',
    createdAt: '2025-06-10',
    updatedAt: '2025-06-10',
    featured: true,
    playCount: 0,
    rating: 5.0,
    ratingCount: 1,
    status: 'active',
    requirements: {
      browser: ['Chrome', 'Firefox', 'Safari', 'Edge'],
      mobile: false,
      keyboard: true,
      mouse: false,
    },
  },
  {
    id: 'memory-cards',
    title: 'Memory Cards',
    description: 'Classic memory card matching game with beautiful themes and difficulty levels. Test your memory by flipping cards and finding matching pairs. Features multiple difficulty levels, beautiful card designs, scoring system, and timer challenges. Perfect for all ages and great for improving memory and concentration skills.',
    shortDescription: 'Match cards and test your memory in this classic game',
    author: 'Dr.',
    authorGithub: 'zona',
    category: 'Casual',
    tags: ['memory', 'cards', 'matching', 'casual', 'puzzle', 'brain-training'],
    difficulty: 'Easy',
    thumbnail: '/games/memory-cards/thumbnail.png',
    screenshots: ['/games/memory-cards/screenshot1.png'],
    playUrl: '/games/memory-cards/index.html',
    createdAt: '2025-06-10',
    updatedAt: '2025-06-10',
    featured: true,
    playCount: 0,
    rating: 5.0,
    ratingCount: 1,
    status: 'active',
    requirements: {
      browser: ['Chrome', 'Firefox', 'Safari', 'Edge'],
      mobile: true,
      keyboard: false,
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