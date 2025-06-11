export interface Game {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  author: string;
  authorGithub?: string;
  category: GameCategory;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  thumbnail: string;
  screenshots: string[];
  playUrl: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  playCount: number;
  rating: number;
  ratingCount: number;
  status: 'active' | 'maintenance' | 'deprecated';
  requirements?: {
    browser?: string[];
    mobile?: boolean;
    keyboard?: boolean;
    mouse?: boolean;
    touch?: boolean;
  };
}

export type GameCategory = 
  | 'Action'
  | 'Adventure'
  | 'Arcade'
  | 'Puzzle'
  | 'Strategy'
  | 'RPG'
  | 'Simulation'
  | 'Sports'
  | 'Racing'
  | 'Educational'
  | 'Casual'
  | 'Multiplayer';

export interface GameFilter {
  category?: GameCategory;
  difficulty?: Game['difficulty'];
  tags?: string[];
  author?: string;
  featured?: boolean;
  search?: string;
}

export interface GameStats {
  totalGames: number;
  totalPlays: number;
  totalAuthors: number;
  categoryCounts: Record<GameCategory, number>;
}