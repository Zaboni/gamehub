import { Game } from '@/lib/types/game';
import { GameCard } from './GameCard';
import { cn } from '@/lib/utils';

interface RelatedGamesProps {
  currentGame: Game;
  className?: string;
}

// Mock related games - in a real app, this would be fetched from an API
const getRelatedGames = (currentGame: Game): Game[] => {
  // This is mock data - replace with actual API call that finds games
  // with similar categories, tags, or by the same author
  return [
    {
      id: 'related-puzzle-1',
      title: 'Logic Blocks',
      description: 'Another challenging puzzle game with block mechanics.',
      shortDescription: 'Challenging block puzzle mechanics',
      author: 'BlockMaster',
      category: 'Puzzle',
      tags: ['puzzle', 'blocks', 'logic'],
      difficulty: 'Medium',
      thumbnail: '/games/logic-blocks/thumbnail.png',
      screenshots: [],
      playUrl: '/games/logic-blocks/index.html',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15',
      featured: false,
      playCount: 850,
      rating: 4.2,
      ratingCount: 18,
      status: 'active',
    },
    {
      id: 'related-puzzle-2',
      title: 'Mind Bender',
      description: 'Test your mental agility with these brain-twisting challenges.',
      shortDescription: 'Brain-twisting mental challenges',
      author: 'BrainDev',
      category: 'Puzzle',
      tags: ['puzzle', 'brain-teaser', 'mental'],
      difficulty: 'Hard',
      thumbnail: '/games/mind-bender/thumbnail.png',
      screenshots: [],
      playUrl: '/games/mind-bender/index.html',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12',
      featured: true,
      playCount: 1200,
      rating: 4.6,
      ratingCount: 25,
      status: 'active',
    },
    {
      id: 'related-casual-1',
      title: 'Quick Match',
      description: 'Fast-paced matching game perfect for quick gaming sessions.',
      shortDescription: 'Fast-paced matching fun',
      author: 'QuickGames',
      category: 'Casual',
      tags: ['casual', 'matching', 'quick'],
      difficulty: 'Easy',
      thumbnail: '/games/quick-match/thumbnail.png',
      screenshots: [],
      playUrl: '/games/quick-match/index.html',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-18',
      featured: false,
      playCount: 950,
      rating: 4.1,
      ratingCount: 16,
      status: 'active',
    },
  ].filter(game => game.id !== currentGame.id);
};

export function RelatedGames({ currentGame, className }: RelatedGamesProps) {
  const relatedGames = getRelatedGames(currentGame);

  if (relatedGames.length === 0) {
    return null;
  }

  return (
    <section className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary-900">
          You Might Also Like
        </h2>
        <p className="text-secondary-600">
          Games similar to {currentGame.title}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedGames.slice(0, 3).map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}