'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RETRY_ATTEMPTS = 3;

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setIsLoading(true);
    setLoadError(false);
    setRetryCount(0);
  }, []);

  const handleRestart = useCallback(() => {
    if (iframeRef.current) {
      setIsLoading(true);
      setLoadError(false);
      iframeRef.current.contentWindow?.location.reload();
    }
  }, []);

  const handleFullscreen = useCallback(() => {
    if (gameContainerRef.current) {
      try {
        if (!document.fullscreenElement) {
          gameContainerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      } catch (error) {
        console.warn('Fullscreen not supported', error);
      }
    }
  }, []);

  const handleOpenInNewTab = useCallback(() => {
    window.open(game.playUrl, '_blank');
  }, [game.playUrl]);

  const handleIframeLoad = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(false);
    setLoadError(false);
    setRetryCount(0);
  }, []);

  const handleIframeError = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    setRetryCount(prev => prev + 1);

    if (retryCount < MAX_RETRY_ATTEMPTS) {
      // Attempt to reload
      setIsLoading(true);
      setLoadError(false);
      if (iframeRef.current) {
        iframeRef.current.src = game.playUrl;
      }
    } else {
      setIsLoading(false);
      setLoadError(true);
      console.error(`Failed to load game iframe for ${game.title} after ${MAX_RETRY_ATTEMPTS} attempts`);
    }
  }, [game.title, retryCount, MAX_RETRY_ATTEMPTS]);

  useEffect(() => {
    if (isLoading) {
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setLoadError(true);
        console.warn(`Game loading timed out for ${game.title}`);
      }, 15000); // 15 seconds timeout
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading, game.title]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-secondary-900">Play Game</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRestart}
            className="btn-secondary flex items-center space-x-2"
            disabled={!isPlaying || isLoading}
            aria-label="Restart game"
            data-testid="game-restart-button"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restart</span>
          </button>
          <button
            onClick={handleFullscreen}
            className="btn-secondary flex items-center space-x-2"
            disabled={!isPlaying || isLoading}
            aria-label="Toggle fullscreen"
            data-testid="game-fullscreen-button"
          >
            <Maximize className="h-4 w-4" />
            <span>Fullscreen</span>
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="btn-secondary flex items-center space-x-2"
            aria-label="Open game in new tab"
            data-testid="game-new-tab-button"
          >
            <ExternalLink className="h-4 w-4" />
            <span>New Tab</span>
          </button>
        </div>
      </div>

      <div
        ref={gameContainerRef}
        className={cn(
          'relative bg-secondary-900 rounded-lg overflow-hidden',
          isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'
        )}
        aria-label={`Game container for ${game.title}`}
        data-testid="game-container"
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
                aria-label={`Start playing ${game.title}`}
                data-testid="game-start-button"
              >
                <Play className="h-5 w-5" />
                <span>Start Game</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {isLoading && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-secondary-900/70"
                data-testid="game-loading-overlay"
              >
                <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full" />
              </div>
            )}
            {loadError && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-secondary-900/90 text-white p-4 text-center"
                data-testid="game-error-overlay"
              >
                <div>
                  <h3 className="text-xl font-bold mb-2">Game Loading Failed</h3>
                  <p className="mb-4">Unable to load the game. Please try again or open in a new tab.</p>
                  <div className="flex space-x-4 justify-center">
                    <button
                      onClick={handlePlay}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg"
                      data-testid="game-retry-button"
                    >
                      Retry
                    </button>
                    <button
                      onClick={handleOpenInNewTab}
                      className="bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-lg"
                      data-testid="game-new-tab-fallback-button"
                    >
                      Open in New Tab
                    </button>
                  </div>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={game.playUrl}
              className="w-full h-full border-0"
              title={game.title}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
              aria-label={`Embedded game: ${game.title}`}
              loading="lazy"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              data-testid="game-iframe"
            />
          </>
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