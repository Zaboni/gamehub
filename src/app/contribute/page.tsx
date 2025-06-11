import { Metadata } from 'next';
import Link from 'next/link';
import { Code, GitBranch, Users, BookOpen, ExternalLink, Github } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contribute',
  description: 'Learn how to contribute games and improvements to GameHub.',
};

export default function ContributePage() {
  const contributionTypes = [
    {
      icon: Code,
      title: 'Add a New Game',
      description: 'Create and submit your own web game to the platform.',
      steps: [
        'Fork the repository',
        'Create your game in the games/ directory',
        'Follow our game template structure',
        'Submit a pull request',
      ],
      cta: 'View Game Template',
      href: '/games/template',
    },
    {
      icon: GitBranch,
      title: 'Improve Existing Games',
      description: 'Fix bugs, add features, or enhance existing games.',
      steps: [
        'Browse the games directory',
        'Find an issue or improvement opportunity',
        'Make your changes',
        'Submit a pull request',
      ],
      cta: 'Browse Games',
      href: '/games',
    },
    {
      icon: Users,
      title: 'Platform Development',
      description: 'Help improve the GameHub platform itself.',
      steps: [
        'Check open issues on GitHub',
        'Pick an issue that interests you',
        'Implement the solution',
        'Submit a pull request',
      ],
      cta: 'View Issues',
      href: SITE_CONFIG.links.github + '/issues',
    },
  ];

  const requirements = [
    'Basic knowledge of HTML, CSS, and JavaScript',
    'Familiarity with Git and GitHub',
    'Understanding of web game development (for game contributions)',
    'Willingness to follow our coding standards and guidelines',
  ];

  const resources = [
    {
      title: 'Game Development Guide',
      description: 'Learn how to create games for GameHub',
      href: '/docs/game-development',
      icon: BookOpen,
    },
    {
      title: 'API Documentation',
      description: 'Understand the GameHub API structure',
      href: '/docs/api',
      icon: Code,
    },
    {
      title: 'Contributing Guidelines',
      description: 'Read our detailed contribution guidelines',
      href: '/docs/contributing',
      icon: Users,
    },
    {
      title: 'GitHub Repository',
      description: 'Access the source code and issues',
      href: SITE_CONFIG.links.github,
      icon: Github,
      external: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-6">
          Contribute to GameHub
        </h1>
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
          Join our community of developers and help build the future of web gaming. 
          Whether you want to add games, fix bugs, or improve the platform, 
          there are many ways to contribute.
        </p>
      </div>

      {/* Contribution Types */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
          Ways to Contribute
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {contributionTypes.map((type, index) => (
            <div key={index} className="card">
              <div className="flex items-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mr-4">
                  <type.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {type.title}
                </h3>
              </div>
              <p className="text-secondary-600 mb-6">
                {type.description}
              </p>
              <div className="mb-6">
                <h4 className="font-medium text-secondary-900 mb-3">Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-secondary-600">
                  {type.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="text-sm">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <Link
                href={type.href}
                target={type.href.startsWith('http') ? '_blank' : undefined}
                rel={type.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <span>{type.cta}</span>
                {type.href.startsWith('http') && <ExternalLink className="h-4 w-4" />}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="mb-16">
        <div className="bg-secondary-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">
            What You Need to Get Started
          </h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                <span className="text-secondary-700">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Resources */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
          Helpful Resources
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <Link
              key={index}
              href={resource.href}
              target={resource.external ? '_blank' : undefined}
              rel={resource.external ? 'noopener noreferrer' : undefined}
              className="card hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-center mb-3">
                <resource.icon className="h-6 w-6 text-primary-600 mr-3" />
                <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors duration-200">
                  {resource.title}
                </h3>
                {resource.external && (
                  <ExternalLink className="h-4 w-4 text-secondary-400 ml-auto" />
                )}
              </div>
              <p className="text-secondary-600 text-sm">
                {resource.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Contributing?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Join our community on GitHub and start making a difference today. 
          Every contribution, no matter how small, helps make GameHub better for everyone.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={SITE_CONFIG.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Github className="h-5 w-5" />
            <span>View on GitHub</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
          <Link
            href="/docs/contributing"
            className="text-white hover:text-primary-100 font-medium py-3 px-8 border border-white/20 rounded-lg transition-colors duration-200"
          >
            Read Contributing Guide
          </Link>
        </div>
      </section>
    </div>
  );
}