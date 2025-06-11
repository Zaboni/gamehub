import Link from 'next/link';
import { Github, Heart, Code } from 'lucide-react';
import { SITE_CONFIG, ROUTES } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Browse Games', href: ROUTES.games },
      { name: 'Contribute', href: ROUTES.contribute },
      { name: 'API Documentation', href: '/docs/api' },
    ],
    community: [
      { name: 'GitHub', href: SITE_CONFIG.links.github },
      { name: 'Discord', href: SITE_CONFIG.links.discord },
      { name: 'Contributing Guide', href: '/docs/contributing' },
    ],
    resources: [
      { name: 'Game Development Guide', href: '/docs/game-development' },
      { name: 'Template Repository', href: '/games/template' },
      { name: 'Best Practices', href: '/docs/best-practices' },
    ],
  };

  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={ROUTES.home} className="flex items-center space-x-2 mb-4">
              <Code className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-secondary-400 mb-4">
              An open-source platform for web games built by the community, for the community.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-400 hover:text-white transition-colors duration-200"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-secondary-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-secondary-400 text-sm">
            © {currentYear} {SITE_CONFIG.name}. Open source and built with{' '}
            <Heart className="inline h-4 w-4 text-red-500 mx-1" />
            by the community.
          </p>
          <p className="text-secondary-400 text-sm mt-2 sm:mt-0">
            Licensed under MIT License
          </p>
        </div>
      </div>
    </footer>
  );
}