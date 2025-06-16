'use client';

import { useState, useEffect } from 'react';
import { GameCard } from './GameCard';
import { Game } from '@/lib/types/game';
import { getAllGames } from '@/lib/data/games';

interface GameGridProps {
  className?: string;
}

export function GameGrid({ className }: GameGridProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load games from centralized data
    const loadGames = async () => {
      setLoading(true);
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 100));
      setGames(getAllGames());
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