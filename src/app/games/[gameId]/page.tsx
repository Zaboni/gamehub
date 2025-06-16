import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GamePlayer } from '@/components/games/GamePlayer';
import { GameInfo } from '@/components/games/GameInfo';
import { GameStats } from '@/components/games/GameStats';
import { getGameById, GAMES_DATA } from '@/lib/data/games';

interface GamePageProps {
  params: {
    gameId: string;
  };
}

async function getGame(gameId: string) {
  return getGameById(gameId);
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

export async function generateStaticParams() {
  return GAMES_DATA.map((game) => ({
    gameId: game.id,
  }));
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

    </div>
  );
}