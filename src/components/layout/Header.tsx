'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Gamepad2, Github, Plus } from 'lucide-react';
import { SITE_CONFIG, ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: ROUTES.home },
    { name: 'Games', href: ROUTES.games },
    { name: 'Contribute', href: ROUTES.contribute },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.home} className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold gradient-text">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-secondary-600 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-600 hover:text-secondary-900 transition-colors duration-200"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href={ROUTES.contribute}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Game</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-secondary-600 hover:text-secondary-900 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden transition-all duration-200 ease-in-out',
            isMenuOpen
              ? 'max-h-64 opacity-100 pb-4'
              : 'max-h-0 opacity-0 overflow-hidden'
          )}
        >
          <nav className="flex flex-col space-y-2 pt-4 border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-secondary-50 rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center justify-between px-3 py-2 border-t pt-4 mt-4">
              <Link
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-600 hover:text-secondary-900 transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href={ROUTES.contribute}
                className="btn-primary flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="h-4 w-4" />
                <span>Add Game</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}