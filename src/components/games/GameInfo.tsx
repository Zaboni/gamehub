import Link from 'next/link';
import { Github, ExternalLink, Calendar, User, Tag } from 'lucide-react';
import { Game } from '@/lib/types/game';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface GameInfoProps {
  game: Game;
  className?: string;
}

export function GameInfo({ game, className }: GameInfoProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Title and Basic Info */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          {game.title}
        </h1>
        <div className="flex items-center space-x-4 text-secondary-600">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>by</span>
            {game.authorGithub ? (
              <Link
                href={`https://github.com/${game.authorGithub}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {game.author}
              </Link>
            ) : (
              <span className="font-medium">{game.author}</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(game.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold text-secondary-900 mb-3">
          About This Game
        </h2>
        <p className="text-secondary-700 leading-relaxed">
          {game.description}
        </p>
      </div>

      {/* Game Details */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-secondary-900 mb-3">Game Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-secondary-600">Category:</dt>
              <dd className="font-medium text-secondary-900">{game.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary-600">Difficulty:</dt>
              <dd className="font-medium text-secondary-900">{game.difficulty}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary-600">Status:</dt>
              <dd className="font-medium text-secondary-900 capitalize">{game.status}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-secondary-600">Last Updated:</dt>
              <dd className="font-medium text-secondary-900">{formatDate(game.updatedAt)}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="font-semibold text-secondary-900 mb-3">Links</h3>
          <div className="space-y-2">
            {game.sourceUrl && (
              <Link
                href={game.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
              >
                <Github className="h-4 w-4" />
                <span>View Source Code</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
            <Link
              href={game.playUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open in New Tab</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-semibold text-secondary-900 mb-3 flex items-center space-x-2">
          <Tag className="h-4 w-4" />
          <span>Tags</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Screenshots */}
      {game.screenshots && game.screenshots.length > 0 && (
        <div>
          <h3 className="font-semibold text-secondary-900 mb-3">Screenshots</h3>
          <div className="grid grid-cols-2 gap-4">
            {game.screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="aspect-video bg-secondary-100 rounded-lg overflow-hidden"
              >
                <img
                  src={screenshot}
                  alt={`${game.title} screenshot ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}