'use client';

import { useState } from 'react';
import { Play, Maximize, RotateCcw, ExternalLink } from 'lucide-react';
import { Game } from '@/lib/types/game';
import { cn } from '@/lib/utils';

interface GamePlayerProps {
  game: Game;
  className?: string;
}

export function GamePlayer({ game, className }: GamePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleRestart = () => {
    // Reload the iframe
    const iframe = document.getElementById('game-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const handleFullscreen = () => {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
      if (!document.fullscreenElement) {
        gameContainer.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleOpenInNewTab = () => {
    window.open(game.playUrl, '_blank');
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary-900">Play Game</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRestart}
            className="btn-secondary flex items-center space-x-2"
            disabled={!isPlaying}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restart</span>
          </button>
          <button
            onClick={handleFullscreen}
            className="btn-secondary flex items-center space-x-2"
            disabled={!isPlaying}
          >
            <Maximize className="h-4 w-4" />
            <span>Fullscreen</span>
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="btn-secondary flex items-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>New Tab</span>
          </button>
        </div>
      </div>

      <div
        id="game-container"
        className={cn(
          'relative bg-secondary-900 rounded-lg overflow-hidden',
          isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'
        )}
      >
        {!isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary-800 to-secondary-900">
            <div className="text-center">
              <div className="mb-6">
                <Play className="h-16 w-16 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Ready to play {game.title}?
                </h3>
                <p className="text-secondary-300">
                  Click the button below to start the game
                </p>
              </div>
              <button
                onClick={handlePlay}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                <Play className="h-5 w-5" />
                <span>Start Game</span>
              </button>
            </div>
          </div>
        ) : (
          <iframe
            id="game-iframe"
            src={game.playUrl}
            className="w-full h-full border-0"
            title={game.title}
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>

      {/* Game Requirements */}
      {game.requirements && (
        <div className="bg-secondary-50 rounded-lg p-4">
          <h4 className="font-medium text-secondary-900 mb-2">Requirements</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-secondary-600">
            {game.requirements.browser && (
              <div>
                <span className="font-medium">Browser:</span>
                <div className="mt-1">
                  {game.requirements.browser.join(', ')}
                </div>
              </div>
            )}
            {game.requirements.keyboard && (
              <div>
                <span className="font-medium">Input:</span>
                <div className="mt-1">Keyboard required</div>
              </div>
            )}
            {game.requirements.mouse && (
              <div>
                <span className="font-medium">Mouse:</span>
                <div className="mt-1">Required</div>
              </div>
            )}
            {game.requirements.mobile && (
              <div>
                <span className="font-medium">Mobile:</span>
                <div className="mt-1">Supported</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}