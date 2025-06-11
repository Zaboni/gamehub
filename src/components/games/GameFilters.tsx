'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { GAME_CATEGORIES, DIFFICULTY_LEVELS } from '@/lib/constants';
import { GameCategory, GameFilter } from '@/lib/types/game';
import { cn } from '@/lib/utils';

interface GameFiltersProps {
  onFilterChange?: (filters: GameFilter) => void;
  className?: string;
}

export function GameFilters({ onFilterChange, className }: GameFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<GameFilter>({});

  const updateFilter = (key: keyof GameFilter, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <div className={cn('relative', className)}>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors duration-200',
          hasActiveFilters
            ? 'bg-primary-50 border-primary-200 text-primary-700'
            : 'bg-white border-secondary-200 text-secondary-700 hover:bg-secondary-50'
        )}
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            {Object.values(filters).filter(v => v !== undefined && v !== '').length}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-secondary-200 rounded-lg shadow-lg p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-secondary-900">Filter Games</h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-secondary-600 hover:text-secondary-900 transition-colors duration-200"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => updateFilter('category', e.target.value as GameCategory || undefined)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {GAME_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Difficulty
              </label>
              <select
                value={filters.difficulty || ''}
                onChange={(e) => updateFilter('difficulty', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-secondary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Difficulties</option>
                {DIFFICULTY_LEVELS.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Filter */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Featured
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="featured"
                    checked={filters.featured === undefined}
                    onChange={() => updateFilter('featured', undefined)}
                    className="mr-2"
                  />
                  <span className="text-sm text-secondary-600">All</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="featured"
                    checked={filters.featured === true}
                    onChange={() => updateFilter('featured', true)}
                    className="mr-2"
                  />
                  <span className="text-sm text-secondary-600">Featured</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}