import { NextRequest, NextResponse } from 'next/server';
import { Game, GameFilter } from '@/lib/types/game';

// Mock games data - replace with actual database queries
const mockGames: Game[] = [
  {
    id: 'puzzle-master',
    title: 'Puzzle Master',
    description: 'A challenging puzzle game that tests your logic and problem-solving skills with increasingly difficult levels.',
    shortDescription: 'Test your logic with challenging puzzles',
    author: 'PuzzleDev',
    authorGithub: 'puzzledev',
    category: 'Puzzle',
    tags: ['puzzle', 'logic', 'brain-teaser'],
    difficulty: 'Medium',
    thumbnail: '/games/puzzle-master/thumbnail.png',
    screenshots: ['/games/puzzle-master/screenshot1.png', '/games/puzzle-master/screenshot2.png'],
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
    description: 'An endless runner game set in space with amazing graphics and smooth gameplay. Navigate through asteroids and collect power-ups.',
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
  // Add more mock games as needed
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    // Filter games based on query parameters
    let filteredGames = mockGames;
    
    if (category) {
      filteredGames = filteredGames.filter(game => game.category === category);
    }
    
    if (difficulty) {
      filteredGames = filteredGames.filter(game => game.difficulty === difficulty);
    }
    
    if (featured === 'true') {
      filteredGames = filteredGames.filter(game => game.featured);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredGames = filteredGames.filter(game =>
        game.title.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower) ||
        game.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        game.author.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort games (featured first, then by play count)
    filteredGames.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.playCount - a.playCount;
    });
    
    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGames = filteredGames.slice(startIndex, endIndex);
    
    // Calculate pagination info
    const totalGames = filteredGames.length;
    const totalPages = Math.ceil(totalGames / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      games: paginatedGames,
      pagination: {
        currentPage: page,
        totalPages,
        totalGames,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This would handle game submissions in a real application
    const gameData = await request.json();
    
    // Validate game data
    if (!gameData.title || !gameData.description || !gameData.author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real app, you would:
    // 1. Validate the game data more thoroughly
    // 2. Save to database
    // 3. Process game files
    // 4. Generate thumbnails
    // 5. Run security checks
    
    return NextResponse.json(
      { message: 'Game submitted successfully', id: 'new-game-id' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting game:', error);
    return NextResponse.json(
      { error: 'Failed to submit game' },
      { status: 500 }
    );
  }
}