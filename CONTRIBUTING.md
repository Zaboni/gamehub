# Contributing to GameHub 🤝

Thank you for your interest in contributing to GameHub! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

### 1. Adding Games
- Submit your own web games
- Improve existing games
- Fix bugs in games

### 2. Platform Development
- Add new features to the platform
- Fix bugs in the codebase
- Improve performance
- Enhance UI/UX

### 3. Documentation
- Improve existing documentation
- Add tutorials and guides
- Translate documentation

### 4. Community
- Help other contributors
- Review pull requests
- Report bugs and issues

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Git
- Basic knowledge of HTML, CSS, JavaScript
- Familiarity with React/Next.js (for platform development)

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/gamehub.git
   cd gamehub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🎮 Adding a Game

### Game Requirements

Your game must:
- Be a web-based game (HTML/CSS/JavaScript)
- Work in modern browsers
- Be family-friendly
- Be your original work or properly licensed
- Include proper attribution for any assets used

### Game Structure

Create your game in the `games/` directory:

```
games/your-game-name/
├── index.html          # Main game file
├── game.json          # Game metadata (required)
├── thumbnail.png      # Game thumbnail 400x300px (required)
├── screenshots/       # Game screenshots (optional)
│   ├── screenshot1.png
│   └── screenshot2.png
├── src/              # Source code (optional but recommended)
├── assets/           # Game assets
└── README.md         # Game documentation (recommended)
```

### Game Metadata (game.json)

```json
{
  "title": "Your Game Title",
  "description": "Detailed description of your game (200-500 words)",
  "shortDescription": "Brief description for game cards (50-100 characters)",
  "author": "Your Name",
  "authorGithub": "your-github-username",
  "category": "Puzzle",
  "tags": ["puzzle", "logic", "brain-teaser"],
  "difficulty": "Medium",
  "version": "1.0.0",
  "requirements": {
    "browser": ["Chrome", "Firefox", "Safari", "Edge"],
    "mobile": true,
    "keyboard": true,
    "mouse": false,
    "touch": true
  },
  "controls": {
    "keyboard": "Arrow keys to move, Space to jump",
    "mouse": "Click to interact",
    "touch": "Tap to interact"
  }
}
```

### Game Categories
- Action
- Adventure
- Arcade
- Puzzle
- Strategy
- RPG
- Simulation
- Sports
- Racing
- Educational
- Casual
- Multiplayer

### Difficulty Levels
- **Easy**: Simple mechanics, suitable for all ages
- **Medium**: Moderate challenge, requires some skill
- **Hard**: Complex mechanics, challenging gameplay

## 💻 Platform Development

### Code Style

- Use TypeScript for all new code
- Follow existing patterns and conventions
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add JSDoc comments for complex functions

### Component Guidelines

- Create reusable components in `src/components/`
- Use proper TypeScript types
- Follow the existing component structure
- Add proper error handling
- Make components responsive

### Testing

- Test your changes thoroughly
- Ensure responsive design works
- Test on different browsers
- Verify accessibility

## 📝 Pull Request Process

### Before Submitting

1. **Test your changes**
   ```bash
   npm run build
   npm run lint
   npm run type-check
   ```

2. **Update documentation** if needed

3. **Add/update tests** if applicable

### Submitting a Pull Request

1. **Create a descriptive title**
   - For games: "Add [Game Name] - [Brief Description]"
   - For features: "Add [Feature Name]"
   - For fixes: "Fix [Issue Description]"

2. **Write a detailed description**
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots (if applicable)

3. **Link related issues**
   - Use "Fixes #123" or "Closes #123"

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New game
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] Tested on different browsers

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Reporting Issues

### Bug Reports

Use the bug report template and include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and device information
- Screenshots or videos if helpful

### Feature Requests

Use the feature request template and include:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Examples from other platforms

## 📋 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Spam or off-topic content

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Game author credits
- Release notes for significant contributions

## 📞 Getting Help

- **GitHub Discussions**: Ask questions and get help
- **Discord**: Join our community chat
- **Issues**: Report bugs or request features

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

Thank you for contributing to GameHub! 🎮