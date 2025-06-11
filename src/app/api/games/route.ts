import { NextRequest, NextResponse } from 'next/server';
import { Game } from '@/lib/types/game';

// Mock games data - replace with actual database queries
const mockGames: Game[] = [
  {
    id: 'space-defender',
    title: 'Space Defender',
    description: 'An exciting space-themed action game where you pilot a spaceship through a dangerous asteroid field. Collect power-ups and coins while avoiding deadly asteroids. The game features smooth controls, particle effects, and progressively increasing difficulty. Test your reflexes and see how high you can score in this endless space adventure!',
    shortDescription: 'Pilot your spaceship, collect power-ups, and avoid asteroids in this thrilling space adventure',
    author: 'Dr.',
    authorGithub: 'zona',
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