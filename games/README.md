# Games Directory 🎮

This directory contains all the games available on GameHub. Each game is stored in its own subdirectory with all necessary files.

## 📁 Directory Structure

```
games/
├── README.md           # This file
├── template/          # Template for new games
└── [game-name]/       # Individual game directories
    ├── index.html     # Main game file
    ├── game.json      # Game metadata
    ├── thumbnail.png  # Game thumbnail
    ├── screenshots/   # Game screenshots
    ├── src/          # Source code
    ├── assets/       # Game assets
    └── README.md     # Game documentation
```

## 🎯 Adding a New Game

1. **Copy the template**
   ```bash
   cp -r games/template games/your-game-name
   ```

2. **Update the metadata**
   Edit `game.json` with your game's information

3. **Replace template files**
   - Replace `index.html` with your game
   - Add your game's thumbnail (400x300px)
   - Add screenshots if available
   - Update the README.md

4. **Test your game**
   Make sure it works in the development environment

5. **Submit a pull request**
   Follow the contributing guidelines

## 📋 Game Requirements

### Technical Requirements
- Must be a web-based game (HTML/CSS/JavaScript)
- Should work in modern browsers (Chrome, Firefox, Safari, Edge)
- Must be responsive or at least mobile-friendly
- Should load within 5 seconds on average connections

### Content Requirements
- Family-friendly content only
- Original work or properly licensed content
- Proper attribution for any third-party assets
- No malicious code or tracking scripts

### File Requirements
- `index.html` - Main game file (required)
- `game.json` - Game metadata (required)
- `thumbnail.png` - Game thumbnail 400x300px (required)
- `README.md` - Game documentation (recommended)
- `screenshots/` - Game screenshots (optional)

## 🏷️ Game Categories

Choose the most appropriate category for your game:

- **Action** - Fast-paced games requiring quick reflexes
- **Adventure** - Story-driven exploration games
- **Arcade** - Classic arcade-style games
- **Puzzle** - Logic and problem-solving games
- **Strategy** - Planning and tactical games
- **RPG** - Role-playing games with character progression
- **Simulation** - Real-world simulation games
- **Sports** - Sports and athletic games
- **Racing** - Racing and driving games
- **Educational** - Learning and educational games
- **Casual** - Easy-to-play, relaxing games
- **Multiplayer** - Games designed for multiple players

## 🎚️ Difficulty Levels

- **Easy** - Simple mechanics, suitable for all ages and skill levels
- **Medium** - Moderate challenge, requires some gaming experience
- **Hard** - Complex mechanics, challenging for experienced players

## 📝 Game Metadata Format

Your `game.json` should follow this format:

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

## 🔍 Quality Guidelines

### Code Quality
- Clean, readable code
- Proper error handling
- No console errors or warnings
- Optimized for performance

### User Experience
- Intuitive controls and interface
- Clear instructions or tutorial
- Responsive design
- Smooth gameplay

### Accessibility
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility (where applicable)
- Clear visual feedback

## 🚀 Testing Your Game

Before submitting, test your game:

1. **Local Testing**
   - Run the development server
   - Test all game features
   - Check for console errors

2. **Browser Testing**
   - Test in Chrome, Firefox, Safari, Edge
   - Test on different screen sizes
   - Test on mobile devices

3. **Performance Testing**
   - Check loading times
   - Monitor memory usage
   - Test with slow connections

## 📞 Need Help?

- Check the [Contributing Guide](../CONTRIBUTING.md)
- Look at existing games for examples
- Ask questions in GitHub Discussions
- Join our Discord community

---

Happy game development! 🎮