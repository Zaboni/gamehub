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
  // Mock games data - in a real app, this would come from your database
  const mockGames: { [key: string]: any } = {
    'space-defender': {
      id: 'space-defender',
      title: 'Space Defender',
      description: 'An exciting space-themed action game where you pilot a spaceship through a dangerous asteroid field. Collect power-ups and coins while avoiding deadly asteroids. The game features smooth controls, particle effects, and progressively increasing difficulty. Test your reflexes and see how high you can score in this endless space adventure!',
      shortDescription: 'Pilot your spaceship, collect power-ups, and avoid asteroids in this thrilling space adventure',
      author: 'Dr.',
      authorGithub: 'zona',
      category: 'Action' as const,
      tags: ['action', 'space', 'arcade', 'endless', 'shooter', 'survival'],
      difficulty: 'Medium' as const,
      thumbnail: '/games/space-defender/thumbnail.png',
      screenshots: ['/games/space-defender/screenshot1.png'],
      playUrl: '/games/space-defender/index.html',
      createdAt: '2025-06-10',
      updatedAt: '2025-06-10',
      featured: true,
      playCount: 0,
      rating: 5.0,
      ratingCount: 1,
      status: 'active' as const,
      requirements: {
        browser: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        mobile: false,
        keyboard: true,
        mouse: false,
        touch: false,
      },
    },
    'puzzle-master': {
      id: 'puzzle-master',
      title: 'Puzzle Master',
      description: 'A challenging logic and brain-teaser game that tests your problem-solving skills with increasingly difficult puzzles. Features 8 progressive levels with number sequences, pattern matching, math puzzles, color sequences, and logic grids. Each level increases in difficulty and includes a scoring system based on efficiency and hints used.',
      shortDescription: 'Test your logic with challenging puzzles across 8 progressive levels',
      author: 'Dr.',
      authorGithub: 'zona',
      category: 'Puzzle' as const,
      tags: ['puzzle', 'logic', 'brain-teaser', 'math', 'patterns'],
      difficulty: 'Medium' as const,
      thumbnail: '/games/puzzle-master/thumbnail.png',
      screenshots: ['/games/puzzle-master/screenshot1.png'],
      playUrl: '/games/puzzle-master/index.html',
      createdAt: '2025-06-10',
      updatedAt: '2025-06-10',
      featured: true,
      playCount: 0,
      rating: 5.0,
      ratingCount: 1,
      status: 'active' as const,
      requirements: {
        browser: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        mobile: true,
        keyboard: true,
        mouse: true,
        touch: true,
      },
    },
    'space-runner': {
      id: 'space-runner',
      title: 'Space Runner',
      description: 'An endless runner game set in space with amazing graphics and smooth gameplay! Navigate through asteroids, collect stars, and see how far you can go! Features physics-based movement, particle effects, progressive difficulty, and real-time stats tracking. Control your cyan spaceship through the endless void of space.',
      shortDescription: 'Navigate through space, collect stars, and avoid asteroids in this endless runner',
      author: 'Dr.',
      authorGithub: 'zona',
      category: 'Action' as const,
      tags: ['action', 'runner', 'space', 'endless', 'arcade', 'physics'],
      difficulty: 'Easy' as const,
      thumbnail: '/games/space-runner/thumbnail.png',
      screenshots: ['/games/space-runner/screenshot1.png'],
      playUrl: '/games/space-runner/index.html',
      createdAt: '2025-06-10',
      updatedAt: '2025-06-10',
      featured: true,
      playCount: 0,
      rating: 5.0,
      ratingCount: 1,
      status: 'active' as const,
      requirements: {
        browser: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        mobile: false,
        keyboard: true,
        mouse: false,
        touch: false,
      },
    },
    'memory-cards': {
      id: 'memory-cards',
      title: 'Memory Cards',
      description: 'Classic memory card matching game with beautiful themes and difficulty levels. Test your memory by flipping cards and finding matching pairs. Features multiple difficulty levels, beautiful card designs, scoring system, and timer challenges. Perfect for all ages and great for improving memory and concentration skills.',
      shortDescription: 'Match cards and test your memory in this classic game',
      author: 'Dr.',
      authorGithub: 'zona',
      category: 'Casual' as const,
      tags: ['memory', 'cards', 'matching', 'casual', 'puzzle', 'brain-training'],
      difficulty: 'Easy' as const,
      thumbnail: '/games/memory-cards/thumbnail.png',
      screenshots: ['/games/memory-cards/screenshot1.png'],
      playUrl: '/games/memory-cards/index.html',
      createdAt: '2025-06-10',
      updatedAt: '2025-06-10',
      featured: true,
      playCount: 0,
      rating: 5.0,
      ratingCount: 1,
      status: 'active' as const,
      requirements: {
        browser: ['Chrome', 'Firefox', 'Safari', 'Edge'],
        mobile: true,
        keyboard: false,
        mouse: true,
        touch: true,
      },
    },
    // Default fallback for other games
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return mockGames[gameId] || mockGames['default'];
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
  // Return the list of game IDs that should be statically generated
  return [
    { gameId: 'space-defender' },
    { gameId: 'puzzle-master' },
    { gameId: 'space-runner' },
    { gameId: 'memory-cards' },
  ];
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