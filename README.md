# GameHub 🎮

An open-source platform for web games built by the community, for the community. GameHub provides a space where developers can showcase their browser-based games and players can discover amazing gaming experiences.

## ✨ Features

- **Game Discovery**: Browse games by category, difficulty, and popularity
- **Community Driven**: All games are open source and community contributed
- **Developer Friendly**: Easy game submission process with templates
- **Modern Tech Stack**: Built with Next.js, TypeScript, and Tailwind CSS
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Game Analytics**: Track plays, ratings, and user engagement

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gamehub.git
   cd gamehub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Project Structure

```
gamehub/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable React components
│   │   ├── ui/             # Basic UI components
│   │   ├── layout/         # Layout components
│   │   ├── games/          # Game-related components
│   │   └── common/         # Common components
│   ├── lib/                # Utility functions and types
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Helper functions
│   │   └── constants/      # App constants
│   ├── hooks/              # Custom React hooks
│   └── styles/             # Global styles
├── games/                  # Game submissions directory
│   ├── template/           # Game template for contributors
│   └── [game-name]/        # Individual game directories
├── public/                 # Static assets
├── docs/                   # Documentation
└── README.md
```

## 🎮 Adding a Game

We welcome game contributions! Here's how to add your game:

### Option 1: Use the Game Template

1. Copy the template from `games/template/`
2. Rename the folder to your game's name
3. Replace the template files with your game
4. Update the game metadata
5. Submit a pull request

### Option 2: Follow the Game Structure

Create a new directory in `games/` with:

```
games/your-game-name/
├── index.html          # Main game file
├── game.json          # Game metadata
├── thumbnail.png      # Game thumbnail (400x300)
├── screenshots/       # Game screenshots
├── src/              # Game source code
└── README.md         # Game documentation
```

### Game Metadata Format

Create a `game.json` file with the following structure:

```json
{
  "title": "Your Game Title",
  "description": "Detailed game description",
  "shortDescription": "Brief description for cards",
  "author": "Your Name",
  "authorGithub": "your-github-username",
  "category": "Puzzle",
  "tags": ["puzzle", "logic", "brain-teaser"],
  "difficulty": "Medium",
  "requirements": {
    "browser": ["Chrome", "Firefox", "Safari"],
    "mobile": true,
    "keyboard": true,
    "mouse": false,
    "touch": true
  }
}
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

### Code Style

- Use TypeScript for all new code
- Follow the existing component patterns
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📚 Documentation

- [Game Development Guide](docs/GAME_DEVELOPMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [API Documentation](docs/API.md)

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### Ways to Contribute

1. **Add Games**: Submit your own web games
2. **Fix Bugs**: Help improve existing games or the platform
3. **Add Features**: Enhance the GameHub platform
4. **Improve Documentation**: Help others understand the project
5. **Report Issues**: Found a bug? Let us know!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Thanks to all contributors who have submitted games
- Built with amazing open-source tools and libraries
- Inspired by the web game development community

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/your-username/gamehub/issues)
- **Discussions**: [Join community discussions](https://github.com/your-username/gamehub/discussions)
- **Discord**: [Join our Discord server](https://discord.gg/gamehub)

---

**Happy Gaming! 🎮**

Made with ❤️ by the GameHub community