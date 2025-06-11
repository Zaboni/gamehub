import Link from 'next/link';
import Image from 'next/image';
import { Star, Play, User, Calendar } from 'lucide-react';
import { Game } from '@/lib/types/game';
import { ROUTES } from '@/lib/constants';
import { formatNumber, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: Game;
  className?: string;
}

export function GameCard({ game, className }: GameCardProps) {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };

  return (
    <Link
      href={ROUTES.game(game.id)}
      className={cn('game-card group', className)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video mb-4 overflow-hidden rounded-lg bg-secondary-100">
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-secondary-400">
            <Play className="h-12 w-12" />
          </div>
        )}
        
        {/* Featured Badge */}
        {game.featured && (
          <div className="absolute top-2 left-2 bg-accent-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </div>
        )}
        
        {/* Difficulty Badge */}
        <div className={cn(
          'absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium',
          difficultyColors[game.difficulty]
        )}>
          {game.difficulty}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title and Category */}
        <div>
          <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-1">
            {game.title}
          </h3>
          <p className="text-sm text-primary-600 font-medium">
            {game.category}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-secondary-600 line-clamp-2">
          {game.shortDescription}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-secondary-500">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
            <span>{game.rating.toFixed(1)}</span>
            <span>({game.ratingCount})</span>
          </div>
          <div className="flex items-center space-x-1">
            <Play className="h-4 w-4" />
            <span>{formatNumber(game.playCount)}</span>
          </div>
        </div>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-xs text-secondary-400">
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>{game.author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(game.createdAt)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {game.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {game.tags.length > 3 && (
            <span className="text-xs text-secondary-400">
              +{game.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}