import Link from 'next/link';
import { ArrowRight, Gamepad2, Users, Code, Star, Play, Github } from 'lucide-react';
import { ROUTES, SITE_CONFIG } from '@/lib/constants';

export default function HomePage() {
  const features = [
    {
      icon: Gamepad2,
      title: 'Diverse Game Collection',
      description: 'Discover games across multiple genres, from puzzle games to action-packed adventures.',
    },
    {
      icon: Code,
      title: 'Open Source',
      description: 'All games are open source. Learn from the code, contribute improvements, or create your own.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by developers, for developers. Join our community and help shape the platform.',
    },
  ];


  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-bold text-secondary-900 mb-6">
              Welcome to{' '}
              <span className="gradient-text">GameHub</span>
            </h1>
            <p className="text-xl sm:text-2xl text-secondary-600 mb-8 text-balance">
              An open-source platform for web games built by the community. 
              Play, contribute, and learn from games created by developers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={ROUTES.games}
                className="btn-primary text-lg px-8 py-3 flex items-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Browse Games</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg px-8 py-3 flex items-center space-x-2"
              >
                <Github className="h-5 w-5" />
                <span>View on GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Our Goal
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              More than just a game platform - it's a community of developers 
              passionate about creating and sharing interactive experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Contribute?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our community of developers and help build the future of web gaming. 
            Whether you're a beginner or expert, there's a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={ROUTES.contribute}
              className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Code className="h-5 w-5" />
              <span>Start Contributing</span>
            </Link>
            <Link
              href="/docs/game-development"
              className="text-white hover:text-primary-100 font-medium py-3 px-8 border border-white/20 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Star className="h-5 w-5" />
              <span>Learn More</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}