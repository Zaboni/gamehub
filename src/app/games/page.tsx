import { Metadata } from 'next';
import { GameGrid } from '@/components/games/GameGrid';
import { GameFilters } from '@/components/games/GameFilters';
import { SearchBar } from '@/components/common/SearchBar';

export const metadata: Metadata = {
  title: 'Browse Games',
  description: 'Discover and play amazing web games created by the community.',
};

export default function GamesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
          Browse Games
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl">
          Discover amazing web games created by our community of developers. 
          Filter by category, difficulty, or search for something specific.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <SearchBar placeholder="Search games..." />
        <GameFilters />
      </div>

      {/* Games Grid */}
      <GameGrid />
    </div>
  );
}