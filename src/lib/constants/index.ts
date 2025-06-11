import { GameCategory } from '../types/game';

export const SITE_CONFIG = {
  name: 'GameHub',
  description: 'An open-source platform for web games built by the community',
  url: 'https://gamehub.dev',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/zaboni/gamehub',
    discord: 'https://discord.gg/gamehub',
  },
};

export const GAME_CATEGORIES: GameCategory[] = [
  'Action',
  'Adventure',
  'Arcade',
  'Puzzle',
  'Strategy',
  'RPG',
  'Simulation',
  'Sports',
  'Racing',
  'Educational',
  'Casual',
  'Multiplayer',
];

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'] as const;

export const GAME_REQUIREMENTS = {
  browser: ['Chrome', 'Firefox', 'Safari', 'Edge'],
  input: ['keyboard', 'mouse', 'touch'],
} as const;

export const ROUTES = {
  home: '/',
  games: '/games',
  game: (id: string) => `/games/${id}`,
  contribute: '/contribute',
  api: {
    games: '/api/games',
    game: (id: string) => `/api/games/${id}`,
  },
} as const;

export const PAGINATION = {
  defaultPageSize: 12,
  maxPageSize: 50,
} as const;