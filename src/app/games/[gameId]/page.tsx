import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GamePlayer } from '@/components/games/GamePlayer';
import { GameInfo } from '@/components/games/GameInfo';
import { GameStats } from '@/components/games/GameStats';
import { RelatedGames } from '@/components/games/RelatedGames';

interface GamePageProps {
  params: {
    gameId: string;
  };
}

// This would typically fetch from your API or database
async function getGame(gameId: string) {
  // Mock data for now - replace with actual API call
  const mockGame = {
    id: gameId,
    title: 'Sample Game',
    description: 'This is a sample game description that would be loaded from your database.',
    shortDescription: 'A fun sample game',
    author: 'Sample Developer',
    authorGithub: 'sample-dev',
    category: 'Puzzle' as const,
    tags: ['puzzle', 'logic', 'brain-teaser'],
    difficulty: 'Medium' as const,
    thumbnail: '/games/sample/thumbnail.png',
    screenshots: ['/games/sample/screenshot1.png', '/games/sample/screenshot2.png'],
    playUrl: '/games/sample/index.html',
    sourceUrl: 'https://github.com/sample-dev/sample-game',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    featured: false,
    playCount: 1250,
    rating: 4.5,
    ratingCount: 23,
    status: 'active' as const,
    requirements: {
      browser: ['Chrome', 'Firefox', 'Safari'],
      mobile: true,
      keyboard: true,
      mouse: true,
      touch: true,
    },
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockGame;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const game = await getGame(params.gameId);
  
  if (!game) {
    return {
      title: 'Game Not Found',
    };
  }

  return {
    title: game.title,
    description: game.shortDescription,
    openGraph: {
      title: game.title,
      description: game.shortDescription,
      images: [game.thumbnail],
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGame(params.gameId);

  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Game Player */}
          <GamePlayer game={game} />
          
          {/* Game Info */}
          <GameInfo game={game} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Game Stats */}
          <GameStats game={game} />
        </div>
      </div>

      {/* Related Games */}
      <div className="mt-16">
        <RelatedGames currentGame={game} />
      </div>
    </div>
  );
}