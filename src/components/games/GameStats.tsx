import { Star, Play, ThumbsUp, Calendar } from 'lucide-react';
import { Game } from '@/lib/types/game';
import { formatNumber, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface GameStatsProps {
  game: Game;
  className?: string;
}

export function GameStats({ game, className }: GameStatsProps) {
  const stats = [
    {
      icon: Star,
      label: 'Rating',
      value: game.rating.toFixed(1),
      subValue: `${game.ratingCount} reviews`,
      color: 'text-yellow-600',
    },
    {
      icon: Play,
      label: 'Plays',
      value: formatNumber(game.playCount),
      subValue: 'total plays',
      color: 'text-primary-600',
    },
    {
      icon: Calendar,
      label: 'Released',
      value: formatDate(game.createdAt),
      subValue: 'creation date',
      color: 'text-secondary-600',
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Game Stats */}
      <div className="card">
        <h3 className="font-semibold text-secondary-900 mb-4">Game Statistics</h3>
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={cn('p-2 rounded-lg bg-secondary-50', stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-secondary-900">
                  {stat.value}
                </div>
                <div className="text-sm text-secondary-600">
                  {stat.subValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Info */}
      <div className="card">
        <h3 className="font-semibold text-secondary-900 mb-4">Quick Info</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary-600">Category:</span>
            <span className="font-medium text-secondary-900">{game.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Difficulty:</span>
            <span className="font-medium text-secondary-900">{game.difficulty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Status:</span>
            <span className={cn(
              'font-medium capitalize',
              game.status === 'active' ? 'text-green-600' : 
              game.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
            )}>
              {game.status}
            </span>
          </div>
          {game.featured && (
            <div className="flex justify-between">
              <span className="text-secondary-600">Featured:</span>
              <span className="font-medium text-accent-600">Yes</span>
            </div>
          )}
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="card">
        <h3 className="font-semibold text-secondary-900 mb-4">Rating Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < Math.floor(game.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-secondary-300'
                  )}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-secondary-900">
              {game.rating.toFixed(1)}
            </span>
          </div>
          <div className="text-sm text-secondary-600">
            Based on {game.ratingCount} review{game.ratingCount !== 1 ? 's' : ''}
          </div>
          
          {/* Simple rating bar */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              // Mock distribution - in real app, this would come from API
              const percentage = stars === Math.floor(game.rating) ? 60 : 
                               stars === Math.floor(game.rating) - 1 ? 25 : 
                               stars === Math.floor(game.rating) + 1 ? 15 : 0;
              
              return (
                <div key={stars} className="flex items-center space-x-2 text-xs">
                  <span className="w-8 text-secondary-600">{stars}★</span>
                  <div className="flex-1 bg-secondary-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-secondary-600">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full btn-primary flex items-center justify-center space-x-2">
          <ThumbsUp className="h-4 w-4" />
          <span>Rate This Game</span>
        </button>
        <button className="w-full btn-secondary">
          Report Issue
        </button>
      </div>
    </div>
  );
}